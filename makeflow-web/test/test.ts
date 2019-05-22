import {main} from 'main-function';

import './@expect';

import {turning} from './@turning';

main(async () => {
  await new Promise<never>(() => {});

  let passed = await turning.test({
    bail: true,
    maxAttempts: 3,
  });

  return passed ? 0 : 1;
});

setInterval(() => {}, 1000);
