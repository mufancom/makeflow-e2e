import {turning} from '../../@turning';

turning.define('0-0/website/').test(async context => {
  let page = await context.getPage('0-0');

  await page.waitFor('.home-view');
});

turning.define('0-1/website/join');

turning.define('0-0/website/login').test(async context => {
  let page = await context.getPage('0-0');

  await page.waitFor('.login-view');
});

turning.define('0-0/website/sign-up/create-account').test(async context => {
  let page = await context.getPage('0-0');

  await page.waitFor('.create-account-view');

  await expect(page).toMatchElement('input[name="mobile"]');

  await expect(page).not.toMatchElement('input[name="code"]');
  await expect(page).not.toMatchElement('input[name="password"]');

  await expect(page).toMatchElement('.submit-button', {
    text: '下一步',
    timeout: 1000,
  });
});

turning
  .define('0-0/website/sign-up/create-account/password-form')
  .test(async context => {
    let page = await context.getPage('0-0');

    await page.waitFor('.create-account-view');

    await expect(page).toMatchElement('input[name="code"]');
    await expect(page).toMatchElement('input[name="password"]');

    await expect(page).toMatchElement('.submit-button', {text: '注册'});
  });

turning
  .define('0-0/website/sign-up/create-organization')
  .test(async context => {
    let page = await context.getPage('0-0');

    await page.waitFor('.create-organization-view');

    await expect(page).toMatchElement('input[name="name"]');
    await expect(page).toMatchElement('input[name="size"]');
    await expect(page).toMatchElement('input[name="industry"]');

    await expect(page).toMatchElement('.submit-button', {text: '下一步'});
  });

turning
  .define('0-0/website/sign-up/complete-user-profile')
  .test(async context => {
    let page = await context.getPage('0-0');

    await page.waitFor('.complete-user-profile-view');

    await expect(page).toMatchElement('input[name="avatar"][type="file"]');
    await expect(page).toMatchElement('input[name="full-name"]');
    await expect(page).toMatchElement('input[name="username"]');

    await expect(page).toMatchElement('.submit-button', {text: '完成'});
  });
