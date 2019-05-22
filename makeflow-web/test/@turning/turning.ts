import * as ChromePaths from 'chrome-paths';
import {
  Browser,
  BrowserContext,
  BrowserOptions,
  Page,
  connect,
  launch,
  ConnectOptions,
  LaunchOptions,
} from 'puppeteer-core';
import {Turning} from 'turning';

const {CI, REMOTE_USERNAME} = process.env;

const REMOTE = !!REMOTE_USERNAME;

export interface TurningContext {
  page: Page;
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

export interface TurningEnvironmentOptions {
  connect?: ConnectOptions;
  launch?: LaunchOptions;
}

export class TurningEnvironment {
  browser!: Browser;
  browserContext!: BrowserContext;

  private connectOptions: ConnectOptions | undefined;
  private launchOptions: LaunchOptions | undefined;

  constructor({
    connect: connectOptions,
    launch: launchOptions,
  }: TurningEnvironmentOptions) {
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
      this.browser.close();
    }
  }

  async before(): Promise<void> {
    this.browserContext = await this.browser.createIncognitoBrowserContext();
  }

  async after(): Promise<void> {
    await this.browserContext.close();
  }

  async newPage(): Promise<Page> {
    return this.browserContext.newPage();
  }
}

export const turning = new Turning<TurningContext, TurningEnvironment>();

turning.setup(async () => {
  let browserOptions: BrowserOptions = {
    // tslint:disable-next-line: no-null-keyword
    defaultViewport: null,
  };

  let options = REMOTE
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

  let environment = new TurningEnvironment(options);

  await environment.setup();

  return environment;
});

turning.teardown(async environment => {
  await environment.teardown();
});

turning.before(async environment => {
  await environment.before();
});

turning.after(async environment => {
  await environment.after();
});

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
