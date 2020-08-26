import expect from 'expect';
import {main} from 'main-function';

import {turning} from './@turning';

/* eslint-disable @mufan/import-groups */

(global as any).expect = expect;

import {setDefaultOptions} from 'expect-puppeteer';

/* eslint-enable @mufan/import-groups */

setDefaultOptions({
  timeout: 1000,
});

main(async () => {
  let passed = await turning.test({
    bail: true,
    maxAttempts: 3,
  });

  return passed ? 0 : 1;
});
