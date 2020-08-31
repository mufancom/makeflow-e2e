import fetch from 'node-fetch';
import {Page} from 'puppeteer-core';
import {TransitionHandler} from 'turning';
import * as v from 'villa';

import {API_E2E_GET_VERIFICATION_CODE_URL} from './@constants';
import {
  TurningContext,
  TurningContextData,
  TurningEnvironment,
} from './@turning';

declare const _entrances: any;

export async function getVerificationCode(): Promise<string> {
  await v.sleep(1000);

  let response = await fetch(API_E2E_GET_VERIFICATION_CODE_URL);
  return response.text();
}

export function generateRandomMobile(): string {
  return `186${Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, '0')}`;
}

export async function pageUISelect(
  page: Page,
  selector: string,
  optionText: string,
): Promise<void> {
  await page.click(selector);
  await (
    await page.$x(
      `//*[contains(@class, "ui-default-option-component") and text()="${optionText}"]`,
    )
  )[0].click();
}

export async function waitForSyncing(page: Page): Promise<void> {
  await page.waitFor('.syncing-info', {hidden: true});
}

export async function waitForRouting(page: Page): Promise<void> {
  for (let i = 0; i < 10; i++) {
    await v.sleep(100);

    let routing = await page.evaluate(() => _entrances.router.$routing);

    if (!routing) {
      return;
    }
  }

  throw new Error('Timeout waiting for routing');
}

export function transition(
  handler: (page: Page, data: TurningContextData) => Promise<void>,
): TransitionHandler<
  TurningContext,
  TurningEnvironment,
  TurningGenericParams['state']
> {
  return async (context, _environment, states) => {
    let id = getUserIdFromStates(states);

    let page = await context.getPage(id);

    await handler(page, context.data);
  };
}

export function getUserIdFromStates(states: string[]): string {
  let userState = states.find(state => state.startsWith('context:'));

  if (!userState) {
    throw new Error('Expecting state `context:[id]`');
  }

  return userState.slice('context:'.length);
}
