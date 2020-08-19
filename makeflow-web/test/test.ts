import expect from 'expect-puppeteer';
import {main} from 'main-function';

import {turning} from './@turning';

expect.setDefaultOptions({
  timeout: 1000,
});

(global as any).expect = expect;

main(async () => {
  let passed = await turning.test({
    bail: true,
    maxAttempts: 3,
  });

  return passed ? 0 : 1;
});
