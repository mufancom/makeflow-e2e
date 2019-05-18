import {turning} from './turning';

turning.define('user:specified');

turning
  .turn([], {
    match: [{not: 'website:sign-up:create-account:password-form'}],
  })
  .to([])
  .by('reloading page', async ({page}) => {
    await page.reload();
  });
