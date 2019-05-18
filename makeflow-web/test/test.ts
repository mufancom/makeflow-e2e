import {main} from 'main-function';

import './@expect';

import {turning} from './@turning';

main(async () => {
  let passed = await turning.test({
    bail: true,
  });

  return passed ? 0 : 1;
});
