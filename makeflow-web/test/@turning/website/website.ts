import {WEBSITE_URL} from '../../@urls';
import {USER_CONTEXT_A} from '../../@users';
import {createContextWithoutPage} from '../../@utils';
import {turning} from '../turning';

turning.define('website:home').test(async ({page}) => {
  await page.waitFor('.home-view');
});

turning
  .initialize(['website:home'])
  .alias('goto home page')
  .by('goto', async ({browserContext}) => {
    let page = await browserContext.newPage();

    page.on('console', message =>
      Promise.all(message.args().map(arg => arg.jsonValue())).then(console.log),
    );

    await page.goto(WEBSITE_URL);

    return {page, ...createContextWithoutPage()};
  });

turning
  .initialize(['website:home'])
  .alias('goto home page (user A not registered)')
  .manual()
  .by('goto', async ({browserContext}) => {
    let page = await browserContext.newPage();

    page.on('console', message =>
      Promise.all(message.args().map(arg => arg.jsonValue())).then(console.log),
    );

    await page.goto(WEBSITE_URL);

    return {page, ...USER_CONTEXT_A};
  });

turning
  .initialize([
    'website:home',
    'session:registered',
    'session:organization-created',
    'user:specified',
  ])
  .alias('goto home page (user A registered)')
  .by('goto', async ({browserContext}) => {
    let page = await browserContext.newPage();

    page.on('console', message =>
      Promise.all(message.args().map(arg => arg.jsonValue())).then(console.log),
    );

    await page.goto(WEBSITE_URL);

    return {page, ...USER_CONTEXT_A};
  });
