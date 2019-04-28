import fetch from 'node-fetch';
import {Page} from 'puppeteer';
import * as v from 'villa';

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
