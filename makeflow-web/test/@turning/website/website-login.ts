import {turning} from '../turning';

turning.define('website:login').test(async ({page}) => {
  await page.waitFor('.login-view');
});

turning
  .turn(['website:home'], {
    match: {not: 'session:logged-in'},
  })
  .to(['website:login'])
  .alias('click login button on home page')
  .by('clicking login button', async ({page}) => {
    await page.click('.login-button');
  });

turning
  .turn(['website:login'], {
    match: 'session:registered',
  })
  .to(['app', 'session:logged-in', 'session:organization-selected'])
  .alias('submit login form')
  .by('submitting login form', async ({page, data}) => {
    let {mobile, password} = data.account!;

    await expect(page).toFill('input[name="mobile"]', mobile);
    await expect(page).toFill('input[name="password"]', password);

    await page.click('.submit-button');

    await page.waitForNavigation();
  });
