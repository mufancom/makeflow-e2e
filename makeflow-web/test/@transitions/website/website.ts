import getOrCreate from 'get-or-create';

import {WEBSITE_URL} from '../../@constants';
import {SESSION_CONTEXT_A} from '../../@sessions';
import {TurningContext, turning} from '../../@turning';
import {
  generateRandomMobile,
  getVerificationCode,
  pageUISelect,
  transition,
} from '../../@utils';

turning
  .initialize(['0-0/website/', 'context:0-0'])
  .alias('goto home page')
  .by('goto', async environment => {
    let context = new TurningContext(environment, {});

    let page = await context.createPage('0-0');

    await page.goto(WEBSITE_URL);

    return context;
  });

turning
  .initialize(['0-0/website/', 'context:0-0'])
  .alias('goto home page (user A not registered)')
  .manual()
  .by('goto', async environment => {
    let context = new TurningContext(environment, SESSION_CONTEXT_A);

    let page = await context.createPage('0-0');

    await page.goto(WEBSITE_URL);

    return context;
  });

turning
  .initialize([
    '0-0/website/',
    'context:0-0',
    'user-0-0:registered',
    'organization-0:created',
  ])
  .alias('goto home page (user A registered)')
  .manual()
  .by('goto', async environment => {
    let context = new TurningContext(environment, SESSION_CONTEXT_A);

    let page = await context.createPage('0-0');

    await page.goto(WEBSITE_URL);

    return context;
  });

turning
  .turn(['0-0/website/'], {
    match: {not: 'user-0-0:logged-in'},
  })
  .to(['0-0/website/login'])
  .alias('click login button on home page')
  .by(
    'clicking login button',
    transition(async page => {
      await page.click('.login-button');
    }),
  );

turning
  .turn(['0-0/website/login'], {
    match: 'user-0-0:registered',
  })
  .to(['0-0/app', 'user-0-0:logged-in', 'user-0-0:organization-selected'])
  .alias('submit login form')
  .by(
    'submitting login form',
    transition(async (page, data) => {
      let {mobile, password} = data.account_0!;

      await expect(page).toFill('input[name="mobile"]', mobile);
      await expect(page).toFill('input[name="password"]', password);

      await page.click('.submit-button');

      await page.waitForNavigation();
    }),
  );

turning
  .turn(['0-0/website/'], {
    match: {not: 'user-0-0:registered'},
  })
  .to(['0-0/website/sign-up/create-account'])
  .alias('click sign-up button on home page')
  .by(
    'clicking sign-up button',
    transition(async page => {
      await page.click('.sign-up-button');
    }),
  );

turning
  .turn(['0-0/website/sign-up/create-account'])
  .to(['0-0/website/sign-up/create-account/password-form'])
  .alias('fill mobile to create account')
  .by(
    'filling mobile and clicking next step button',
    transition(async (page, data) => {
      let {mobile} = getOrCreate(data)
        .property('account_0', {
          mobile: generateRandomMobile(),
          password: 'abc123',
        })
        .exec();

      await expect(page).toFill('input[name="mobile"]', mobile);

      await expect(page).toMatchElement('.submit-button:not(:disabled)');

      await page.click('.submit-button:not(:disabled)');
    }),
  );

turning
  .turn(['0-0/website/sign-up/create-account/password-form'])
  .to([
    '0-0/website/sign-up/create-organization',
    'user-0-0:registered',
    'user-0-0:logged-in',
  ])
  .alias('submit form to create account')
  .by(
    'filling form and clicking submit button',
    transition(async (page, data) => {
      let {password} = data.account_0!;

      let code = await getVerificationCode();

      await expect(page).toFill('input[name="code"]', code);
      await expect(page).toFill('input[name="password"]', password);

      await page.click('.submit-button');
    }),
  );

turning
  .turn(['0-0/website/sign-up/create-organization'])
  .to([
    '0-0/website/sign-up/complete-user-profile',
    'organization-0:created',
    'user-0-0:organization-selected',
  ])
  .alias('create organization')
  .by(
    'filling form and clicking next step button',
    transition(async (page, data) => {
      let {displayName, size, industry} = getOrCreate(data)
        .property('organization_0', {
          displayName: '测试组织',
          size: '10 ~ 50人',
          industry: '其他',
        })
        .exec();

      await expect(page).toFill('input[name="name"]', displayName);

      await pageUISelect(page, 'input[name="size"]', size);

      await pageUISelect(page, 'input[name="industry"]', industry);

      await expect(page).toMatchElement('.submit-button:not(:disabled)');

      await page.click('.submit-button:not(:disabled)');
    }),
  );

turning
  .turn(['0-0/website/sign-up/complete-user-profile'])
  .to(['0-0/app'])
  .alias('complete user profile')
  .by(
    'filling form and clicking complete button',
    transition(async (page, data) => {
      let {fullName, username} = getOrCreate(data.account_0!)
        .property('user_0', {
          fullName: '测试',
          username: 'ceshi',
        })
        .exec();

      await expect(page).toFill('input[name="full-name"]', fullName);

      await expect(page).toMatchElement(
        `input[name="username"][value="${username}"]`,
        {
          timeout: 1000,
        },
      );

      await page.click('.submit-button');

      await page.waitForNavigation();
    }),
  );
