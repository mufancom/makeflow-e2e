import expect from 'expect';
import {main} from 'main-function';

import './@states';
import './@transitions';

import {turning} from './@turning';

/* eslint-disable @mufan/import-groups */

(global as any).expect = expect;

import {setDefaultOptions} from 'expect-puppeteer';

/* eslint-enable @mufan/import-groups */

const {CI} = process.env;

setDefaultOptions({
  timeout: 1000,
});

main(async () => {
  let passed = await turning.test(
    CI
      ? {
          bail: true,
          maxAttempts: 3,
          allowUnreachable: true,
          verbose: true,
        }
      : {
          bail: true,
          allowUnreachable: true,
          verbose: true,
        },
  );

  return passed ? 0 : 1;
});
