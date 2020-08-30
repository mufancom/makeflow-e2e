import {WEBSITE_URL} from '../../@constants';
import {TurningContext, turning} from '../../@turning';
import {USER_CONTEXT_A} from '../../@users';
import {
  createTurningContextData,
  generateRandomMobile,
  getVerificationCode,
  pageUISelect,
} from '../../@utils';

turning
  .initialize(['/website/home'])
  .alias('goto home page')
  .by('goto', async environment => {
    let context = new TurningContext(environment, createTurningContextData());

    let page = await context.createPage();

    await page.goto(WEBSITE_URL);

    return context;
  });

turning
  .initialize(['/website/home'])
  .alias('goto home page (user A not registered)')
  .manual()
  .by('goto', async environment => {
    let context = new TurningContext(environment, USER_CONTEXT_A);

    let page = await context.createPage();

    await page.goto(WEBSITE_URL);

    return context;
  });

turning
  .initialize([
    '/website/home',
    'session:registered',
    'session:organization-created',
  ])
  .alias('goto home page (user A registered)')
  .manual()
  .by('goto', async environment => {
    let context = new TurningContext(environment, USER_CONTEXT_A);

    let page = await context.createPage();

    await page.goto(WEBSITE_URL);

    return context;
  });

turning
  .turn(['/website/home'], {
    match: {not: 'session:logged-in'},
  })
  .to(['/website/login'])
  .alias('click login button on home page')
  .by('clicking login button', async context => {
    let page = await context.getPage();

    await page.click('.login-button');
  });

turning
  .turn(['/website/login'], {
    match: 'session:registered',
  })
  .to(['/app', 'session:logged-in', 'session:organization-selected'])
  .alias('submit login form')
  .by('submitting login form', async context => {
    let page = await context.getPage();

    let {mobile, password} = context.data.account!;

    await expect(page).toFill('input[name="mobile"]', mobile);
    await expect(page).toFill('input[name="password"]', password);

    await page.click('.submit-button');

    await page.waitForNavigation();
  });

turning
  .turn(['/website/home'], {
    match: {not: 'session:registered'},
  })
  .to(['/website/sign-up/create-account'])
  .alias('click sign-up button on home page')
  .by('clicking sign-up button', async context => {
    let page = await context.getPage();

    await page.click('.sign-up-button');
  });

turning
  .turn(['/website/sign-up/create-account'])
  .to(['/website/sign-up/create-account/password-form'])
  .alias('fill mobile to create account')
  .by('filling mobile and clicking next step button', async context => {
    let page = await context.getPage();
    let data = context.data;

    let {mobile, password} = data.account || {
      mobile: generateRandomMobile(),
      password: 'abc123',
    };

    await expect(page).toFill('input[name="mobile"]', mobile);

    await expect(page).toMatchElement('.submit-button:not([disabled])');

    await page.click('.submit-button:not([disabled])');

    data.account = {
      mobile,
      password,
    };
  });

turning
  .turn(['/website/sign-up/create-account/password-form'])
  .to([
    '/website/sign-up/create-organization',
    'session:registered',
    'session:logged-in',
  ])
  .alias('submit form to create account')
  .by('filling form and clicking submit button', async context => {
    let page = await context.getPage();

    let {password} = context.data.account!;

    let code = await getVerificationCode();

    await expect(page).toFill('input[name="code"]', code);
    await expect(page).toFill('input[name="password"]', password);

    await page.click('.submit-button');
  });

turning
  .turn(['/website/sign-up/create-organization'])
  .to([
    '/website/sign-up/complete-user-profile',
    'session:organization-created',
    'session:organization-selected',
  ])
  .alias('create organization')
  .by('filling form and clicking next step button', async context => {
    let page = await context.getPage();
    let data = context.data;

    let {name, size, industry} = data.organization || {
      name: '测试组织',
      size: '10 ~ 50人',
      industry: '其他',
    };

    await expect(page).toFill('input[name="name"]', name);

    await pageUISelect(page, 'input[name="size"]', size);

    await pageUISelect(page, 'input[name="industry"]', industry);

    await expect(page).toMatchElement('.submit-button:not([disabled])');

    await page.click('.submit-button:not([disabled])');

    data.organization = {
      name,
      size,
      industry,
    };
  });

turning
  .turn(['/website/sign-up/complete-user-profile'])
  .to(['/app'])
  .alias('complete user profile')
  .by('filling form and clicking complete button', async context => {
    let page = await context.getPage();
    let data = context.data;

    let {fullName, username} = data.user || {
      fullName: '测试',
      username: 'ceshi',
    };

    await expect(page).toFill('input[name="full-name"]', fullName);

    await expect(page).toMatchElement(
      `input[name="username"][value="${username}"]`,
      {
        timeout: 1000,
      },
    );

    await page.click('.submit-button');

    await page.waitForNavigation();

    data.user = {
      fullName,
      username,
    };
  });
