import fetch from 'node-fetch';
import {Page} from 'puppeteer-core';
import {OmitValueOfKey} from 'tslang';
import * as v from 'villa';

import {TurningContext} from './@turning';
import {API_E2E_GET_VERIFICATION_CODE_URL} from './@urls';

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

export type TurningContextWithoutPage = OmitValueOfKey<TurningContext, 'page'>;

export function createContextWithoutPage(
  partial: Partial<TurningContextWithoutPage> = {},
): TurningContextWithoutPage {
  return {
    idea: {
      active: [],
    },
    ...partial,
  };
}

export async function pageUISelect(
  page: Page,
  selector: string,
  optionText: string,
): Promise<void> {
  await page.click(selector);
  await (await page.$x(
    `//*[contains(@class, "ui-default-option-component") and text()="${optionText}"]`,
  ))[0].click();
}

export async function waitForSyncing(page: Page): Promise<void> {
  await page.waitFor('.syncing-info:not(.syncing)');
}
