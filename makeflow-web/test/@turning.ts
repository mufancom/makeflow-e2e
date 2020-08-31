import * as Path from 'path';

import * as ChromePaths from 'chrome-paths';
import * as FSExtra from 'fs-extra';
import _ from 'lodash';
import {
  Browser,
  BrowserContext,
  BrowserOptions,
  ConnectOptions,
  LaunchOptions,
  Page,
  connect,
  launch,
} from 'puppeteer-core';
import {
  AbstractTurningContext,
  AbstractTurningEnvironment,
  StateMatchingPattern,
  Turning,
  TurningEnvironmentAfterEachData,
} from 'turning';

const STATE_MATCHING_PATTERN_TYPES = ['modal', 'navigation-block'] as const;

const APP_ROUTE_TYPES = ['primary', 'sidebar', 'overlay'].sort();

const SCREENSHOTS_DIR = '/tmp/screenshots';

const {CI, REMOTE_USER_NAME} = process.env;

const REMOTE = !!REMOTE_USER_NAME;

export interface TurningContextData {
  account_0?: {
    mobile: string;
    password: string;
    user_0?: {
      fullName: string;
      username: string;
    };
  };
  organization_0?: {
    displayName: string;
    size: string;
    industry: string;
    joinLink?: string;
  };
  idea?: {
    active: string[];
  };
  task?: {
    numericId: string;
    brief: string;
  };
  procedure?: {
    simple?: {
      displayName: string;
    };
  };
}

export class TurningContext extends AbstractTurningContext {
  private pagePromiseMap = new Map<string, Promise<Page>>();

  constructor(
    readonly environment: TurningEnvironment,
    readonly data: TurningContextData,
  ) {
    super();
  }

  async createPage(contextId: string): Promise<Page> {
    let pagePromiseMap = this.pagePromiseMap;

    let promise = pagePromiseMap.get(contextId);

    if (promise) {
      throw new Error(`Page of context id ${contextId} already created`);
    }

    let pagePromise = this.environment.createPage(contextId).then(page => {
      page.on('pageerror', error => this.emit('error', error));
      return page;
    });

    pagePromiseMap.set(contextId, pagePromise);

    return pagePromise;
  }

  async getPage(contextId: string): Promise<Page> {
    let promise = this.pagePromiseMap.get(contextId);

    if (!promise) {
      throw new Error(
        `Page of context id ${contextId} has not been created yet`,
      );
    }

    return promise;
  }

  async getPages(): Promise<(Page | undefined)[]> {
    return Promise.all(this.pagePromiseMap.values());
  }

  spawn(): this {
    return new TurningContext(this.environment, _.cloneDeep(this.data)) as this;
  }
}

export interface TurningEnvironmentOptions {
  connect?: ConnectOptions;
  launch?: LaunchOptions;
}

export class TurningEnvironment extends AbstractTurningEnvironment<
  TurningContext
> {
  private browser!: Browser;
  private browserContextPromiseMap = new Map<string, Promise<BrowserContext>>();

  private connectOptions: ConnectOptions | undefined;
  private launchOptions: LaunchOptions | undefined;

  constructor({
    connect: connectOptions,
    launch: launchOptions,
  }: TurningEnvironmentOptions) {
    super();

    this.connectOptions = connectOptions;
    this.launchOptions = launchOptions;
  }

  async setup(): Promise<void> {
    await FSExtra.emptyDir(SCREENSHOTS_DIR);

    if (this.connectOptions) {
      this.browser = await connect(this.connectOptions);
    } else {
      this.browser = await launch(this.launchOptions);
    }
  }

  async teardown(): Promise<void> {
    if (!this.connectOptions) {
      await this.browser.close();
    }
  }

  async after(): Promise<void> {
    let browserContextPromiseMap = this.browserContextPromiseMap;

    let browserContexts = await Promise.all(browserContextPromiseMap.values());

    for (let browserContext of browserContexts) {
      await browserContext.close();
    }

    browserContextPromiseMap.clear();
  }

  async afterEach(
    context: TurningContext,
    {id, attempts, passed}: TurningEnvironmentAfterEachData,
  ): Promise<void> {
    let pages = await context.getPages();

    for (let [index, page] of pages.entries()) {
      if (!page) {
        continue;
      }

      await page.screenshot({
        path: Path.join(
          SCREENSHOTS_DIR,
          `${id}-attempt-${attempts + 1}-context-${index}-${
            passed ? 'passed' : 'failed'
          }.png`,
        ),
      });

      await page.close();
    }
  }

  async createPage(contextId: string): Promise<Page> {
    let browserContextPromiseMap = this.browserContextPromiseMap;

    let browserContextPromise = browserContextPromiseMap.get(contextId);

    if (!browserContextPromise) {
      browserContextPromise = this.browser.createIncognitoBrowserContext();
      browserContextPromiseMap.set(contextId, browserContextPromise);
    }

    let browserContext = await browserContextPromise;

    return browserContext.newPage();
  }
}

const browserOptions: BrowserOptions = {
  defaultViewport: {
    width: 1920,
    height: 800,
  },
};

const options = REMOTE
  ? {
      connect: {
        browserURL: 'http://localhost:9222',
        ...browserOptions,
      },
    }
  : {
      launch: {
        headless: !!CI,
        executablePath: ChromePaths.chrome || ChromePaths.chromium,
        args: [
          '--disable-infobars',
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
        ...browserOptions,
      },
    };

const environment = new TurningEnvironment(options);

export const turning = new Turning<
  TurningContext,
  TurningEnvironment,
  TurningGenericParams
>(environment, {
  statesCombinationValidator(states) {
    let appRouteStates = states.filter(state => /^\d+-\d+\/app\//.test(state));

    if (appRouteStates.length) {
      let appRouteEntriesDict = _.groupBy(
        appRouteStates.map(state => {
          let [, id, type] = state.match(/^(\d+-\d+)\/app\/([^/]*)/)!;

          return {
            id,
            type,
          };
        }),
        entry => entry.id,
      );

      for (let entries of Object.values(appRouteEntriesDict)) {
        let types = entries.map(entry => entry.type).sort();

        if (!_.isEqual(APP_ROUTE_TYPES, types)) {
          throw new Error(
            `Unexpected app route types found in states combination:\n${states
              .map(state => `  ${state}`)
              .join('\n')}`,
          );
        }
      }
    }

    let activeUserStates = states.filter(state => /^context:/.test(state));

    if (activeUserStates.length !== 1) {
      throw new Error(
        'Expecting one and only one `context:[id]` state at the same time',
      );
    }
  },
});

turning.pattern(getStateMatchingPatternsWithout('0-0'));
turning.pattern('0-0-modal', getStateMatchingPatternsWithout('0-0', ['modal']));
turning.pattern(
  '0-0-to-0-1',
  getStateMatchingPatternsWithout('0-0', '0-1', []),
);

turning.case('register user A', [
  'goto home page (user A not registered)',
  'click sign-up button on home page',
  'fill mobile to create account',
  'submit form to create account',
  'create organization',
  'complete user profile',
]);

turning.case('logout user A from workbench', [
  'goto home page (user A registered)',
  'click login button on home page',
  'submit login form',
  'transit to workbench',
  'click app logout link',
]);

export type StateMatchingPatternType = typeof STATE_MATCHING_PATTERN_TYPES[number];

export interface StateMatchingPatternOptions {
  context?: string;
  types?: StateMatchingPatternType[];
}

export function getStateMatchingPatternsWithout(
  contextId: string,
  types?: StateMatchingPatternType[],
): StateMatchingPattern<TurningGenericParams['statePattern']>[];
export function getStateMatchingPatternsWithout(
  sourceContextId: string,
  targetContextId: string,
  types?: StateMatchingPatternType[],
): StateMatchingPattern<TurningGenericParams['statePattern']>[];
export function getStateMatchingPatternsWithout(
  ...args: any[]
): StateMatchingPattern<TurningGenericParams['statePattern']>[] {
  let sourceContextId: string;
  let targetContextId: string;
  let types: string[];

  if (typeof args[1] === 'string') {
    [sourceContextId, targetContextId, types = []] = args;
  } else {
    [sourceContextId, types = []] = args;
    targetContextId = sourceContextId;
  }

  return [
    `context:${sourceContextId}` as TurningGenericParams['state'],
    ..._.difference(STATE_MATCHING_PATTERN_TYPES, types).map(type => {
      return {
        not: `${type}-${targetContextId}:*`,
      } as StateMatchingPattern<TurningGenericParams['statePattern']>;
    }),
  ];
}
