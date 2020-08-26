import {turning} from '../@turning';

turning.define('website:home').test(async ({page}) => {
  await page.waitFor('.home-view');
});

turning.define('website:login').test(async ({page}) => {
  await page.waitFor('.login-view');
});

turning.define('website:sign-up:create-account').test(async ({page}) => {
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
  .define('website:sign-up:create-account:password-form')
  .test(async ({page}) => {
    await page.waitFor('.create-account-view');

    await expect(page).toMatchElement('input[name="code"]');
    await expect(page).toMatchElement('input[name="password"]');

    await expect(page).toMatchElement('.submit-button', {text: '注册'});
  });

turning.define('website:sign-up:create-organization').test(async ({page}) => {
  await page.waitFor('.create-organization-view');

  await expect(page).toMatchElement('input[name="name"]');
  await expect(page).toMatchElement('input[name="size"]');
  await expect(page).toMatchElement('input[name="industry"]');

  await expect(page).toMatchElement('.submit-button', {text: '下一步'});
});

turning.define('website:sign-up:complete-user-profile').test(async ({page}) => {
  await page.waitFor('.complete-user-profile-view');

  await expect(page).toMatchElement('input[name="avatar"][type="file"]');
  await expect(page).toMatchElement('input[name="full-name"]');
  await expect(page).toMatchElement('input[name="username"]');

  await expect(page).toMatchElement('.submit-button', {text: '完成'});
});
