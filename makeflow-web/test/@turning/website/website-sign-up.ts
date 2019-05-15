import {
  generateRandomMobile,
  getVerificationCode,
  pageUISelect,
} from '../../@utils';
import {turning} from '../turning';

turning.define('website:sign-up:create-account').test(async () => {
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
  .test(async () => {
    await page.waitFor('.create-account-view');

    await expect(page).toMatchElement('input[name="code"]');
    await expect(page).toMatchElement('input[name="password"]');

    await expect(page).toMatchElement('.submit-button', {text: '注册'});
  });

turning.define('website:sign-up:create-organization').test(async () => {
  await page.waitFor('.create-organization-view');

  await expect(page).toMatchElement('input[name="name"]');
  await expect(page).toMatchElement('input[name="size"]');
  await expect(page).toMatchElement('input[name="industry"]');

  await expect(page).toMatchElement('.submit-button', {text: '下一步'});
});

turning.define('website:sign-up:complete-user-profile').test(async () => {
  await page.waitFor('.complete-user-profile-view');

  await expect(page).toMatchElement('input[name="avatar"][type="file"]');
  await expect(page).toMatchElement('input[name="full-name"]');
  await expect(page).toMatchElement('input[name="username"]');

  await expect(page).toMatchElement('.submit-button', {text: '完成'});
});

turning
  .turn(['website:home'], {
    match: {not: 'session:registered'},
  })
  .to(['website:sign-up:create-account'])
  .alias('click sign-up button on home page')
  .by('clicking sign-up button', async () => {
    await page.click('.sign-up-button');
  });

turning
  .turn(['website:sign-up:create-account'])
  .to(['website:sign-up:create-account:password-form'])
  .alias('fill mobile to create account')
  .by('filling mobile and clicking next step button', async context => {
    let {mobile, password} = context.account || {
      mobile: generateRandomMobile(),
      password: 'abc123',
    };

    await expect(page).toFill('input[name="mobile"]', mobile);

    await page.click('.submit-button');

    context.account = {
      mobile,
      password,
    };
  });

turning
  .turn(['website:sign-up:create-account:password-form'])
  .to([
    'website:sign-up:create-organization',
    'session:registered',
    'session:logged-in',
  ])
  .alias('submit form to create account')
  .by('filling form and clicking submit button', async context => {
    let {password} = context.account!;

    let code = await getVerificationCode();

    await expect(page).toFill('input[name="code"]', code);
    await expect(page).toFill('input[name="password"]', password);

    await page.click('.submit-button');
  });

turning
  .turn(['website:sign-up:create-organization'])
  .to([
    'website:sign-up:complete-user-profile',
    'session:organization-created',
    'session:organization-selected',
  ])
  .alias('create organization')
  .by('filling form and clicking next step button', async context => {
    let {name, size, industry} = context.organization || {
      name: '测试组织',
      size: '10 ~ 50人',
      industry: '其他',
    };

    await expect(page).toFill('input[name="name"]', name);

    await pageUISelect(page, 'input[name="size"]', size);

    await pageUISelect(page, 'input[name="industry"]', industry);

    await page.click('.submit-button');

    context.organization = {
      name,
      size,
      industry,
    };
  });

turning
  .turn(['website:sign-up:complete-user-profile'])
  .to(['app'])
  .alias('complete user profile')
  .by('filling form and clicking complete button', async context => {
    let {fullName, username} = context.user || {
      fullName: '测试',
      username: 'ceshi',
    };

    await expect(page).toFill('input[name="full-name"]', fullName);

    await expect(page).toMatchElement(
      `input[name="username"][value="${username}"]`,
      {timeout: 1000},
    );

    await page.click('.submit-button');

    await page.waitForNavigation();

    context.user = {
      fullName,
      username,
    };
  });
