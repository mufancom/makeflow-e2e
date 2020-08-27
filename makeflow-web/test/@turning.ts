import * as Path from 'path';

import * as ChromePaths from 'chrome-paths';
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
  Turning,
  TurningEnvironmentAfterEachData,
} from 'turning';

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
}

export class TurningContext extends AbstractTurningContext {
  constructor(readonly page: Page, readonly data: TurningContextData) {
    super();

    page.on('pageerror', error => this.emit('error', error));
  }

  spawn(): this {
    return new TurningContext(this.page, _.cloneDeep(this.data)) as this;
  }
}

export interface TurningEnvironmentOptions {
  connect?: ConnectOptions;
  launch?: LaunchOptions;
}

export class TurningEnvironment extends AbstractTurningEnvironment<
  TurningContext
> {
  browser!: Browser;
  browserContext!: BrowserContext;

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
    this.browserContext = await this.browser.createIncognitoBrowserContext();
  }

  async after(): Promise<void> {
    await this.browserContext.close();
  }

  async afterEach(
    {page}: TurningContext,
    {id, attempts, passed}: TurningEnvironmentAfterEachData,
  ): Promise<void> {
    await page.screenshot({
      path: Path.join(
        SCREENSHOTS_DIR,
        `${id}-${attempts + 1}-${passed ? 'passed' : 'failed'}.png`,
      ),
    });
  }

  async newPage(): Promise<Page> {
    return this.browserContext.newPage();
  }
}

const browserOptions: BrowserOptions = {
  defaultViewport: {
    width: 1200,
    height: 600,
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
  TurningPattern,
  TurningState,
  TurningAlias
>(environment);

turning.pattern({not: 'modal:*'});

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
