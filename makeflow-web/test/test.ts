import {main} from 'main-function';

import './@expect';

import {turning} from './@turning';

main(async () => {
  let passed = await turning.test({
    bail: true,
    maxAttempts: 3,
  });

  return passed ? 0 : 1;
});
