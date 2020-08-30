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
  account?: {
    mobile: string;
    password: string;
  };
  organization?: {
    name: string;
    size: string;
    industry: string;
  };
  user?: {
    fullName: string;
    username: string;
  };
  idea: {
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
  private pagePromises: (Promise<Page> | undefined)[] = [];

  constructor(
    readonly environment: TurningEnvironment,
    readonly data: TurningContextData,
  ) {
    super();
  }

  async createPage(index = 0): Promise<Page> {
    let pagePromises = this.pagePromises;

    let promise = pagePromises[index];

    if (promise) {
      throw new Error(`Page of index ${index} already created`);
    }

    let pagePromise = this.environment.createPage(index).then(page => {
      page.on('pageerror', error => this.emit('error', error));
      return page;
    });

    pagePromises[index] = pagePromise;

    return pagePromise;
  }

  async getPage(index = 0): Promise<Page> {
    let promise = this.pagePromises[index];

    if (!promise) {
      throw new Error(`Page of index ${index} has not been created yet`);
    }

    return promise;
  }

  async getPages(): Promise<(Page | undefined)[]> {
    return Promise.all(this.pagePromises);
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
  private browserContextPromises!: (Promise<BrowserContext> | undefined)[];

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

  async before(): Promise<void> {
    this.browserContextPromises = [];
  }

  async after(): Promise<void> {
    let browserContexts = _.compact(
      await Promise.all(this.browserContextPromises),
    );

    for (let browserContext of browserContexts) {
      await browserContext.close();
    }
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

  async createPage(index: number): Promise<Page> {
    let browserContextPromises = this.browserContextPromises;

    let browserContextPromise = browserContextPromises[index];

    if (!browserContextPromise) {
      browserContextPromise = this.browser.createIncognitoBrowserContext();
      browserContextPromises[index] = browserContextPromise;
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
    let appRouteStates = states.filter(state => /^\/app\//.test(state));

    if (appRouteStates.length) {
      let appRouteTypes = appRouteStates
        .map(
          // eslint-disable-next-line @mufan/no-unnecessary-type-assertion
          state => state.match(/^\/app\/([^/]*)/)![1],
        )
        .sort();

      if (!_.isEqual(APP_ROUTE_TYPES, appRouteTypes)) {
        throw new Error(
          `Unexpected app route types found in states combination:\n${states
            .map(state => `  ${state}`)
            .join('\n')}`,
        );
      }
    }
  },
});

turning.pattern(getStateMatchingPatternsWithout([]));

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

export function getStateMatchingPatternsWithout(
  types: StateMatchingPatternType[],
): StateMatchingPattern<TurningGenericParams['statePattern']>[] {
  return _.difference(STATE_MATCHING_PATTERN_TYPES, types).map(type => {
    return {
      not: `${type}:*`,
    } as StateMatchingPattern<TurningGenericParams['statePattern']>;
  });
}
