import {turning} from '../@turning';
import {transition} from '../@utils';

turning
  .turn([], {
    match: [{not: '0-0/website/sign-up/create-account/password-form'}],
  })
  .to([])
  .by(
    'reloading page',
    transition(async page => {
      await page.reload();
    }),
  );
