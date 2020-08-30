import {turning} from '../@turning';

turning
  .turn([], {
    match: [{not: '/website/sign-up/create-account/password-form'}],
  })
  .to([])
  .by('reloading page', async context => {
    let page = await context.getPage();

    await page.reload();
  });
