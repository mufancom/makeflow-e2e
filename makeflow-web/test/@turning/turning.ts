import * as ChromePaths from 'chrome-paths';
import {Browser, BrowserContext, Page, launch} from 'puppeteer';
import {Turning} from 'turning';

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

export interface TurningEnvironment {
  browser: Browser;
  browserContext: BrowserContext;
}

export const turning = new Turning<TurningContext, TurningEnvironment>();

turning.setup(async () => {
  let browser = await launch({
    headless: !!process.env.CI,
    executablePath: ChromePaths.chrome,
    // tslint:disable-next-line: no-null-keyword
    defaultViewport: null,
    args: ['--disable-infobars'],
  });

  return {
    browser,
    browserContext: undefined!,
  };
});

turning.teardown(async ({browser}) => {
  await browser.close();
});

turning.before(async context => {
  context.browserContext = await context.browser.createIncognitoBrowserContext();
});

turning.after(async context => {
  await context.browserContext.close();
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
  'restore app workbench page',
  'click app logout link',
]);
