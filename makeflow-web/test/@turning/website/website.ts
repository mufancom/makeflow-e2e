import {WEBSITE_URL} from '../../@urls';
import {USER_CONTEXT_A} from '../../@users';
import {createTurningContextData} from '../../@utils';
import {TurningContext, turning} from '../turning';

turning.define('website:home').test(async ({page}) => {
  await page.waitFor('.home-view');
});

turning
  .initialize(['website:home'])
  .alias('goto home page')
  .by('goto', async environment => {
    let page = await environment.newPage();

    await page.goto(WEBSITE_URL);

    return new TurningContext(page, createTurningContextData());
  });

turning
  .initialize(['website:home'])
  .alias('goto home page (user A not registered)')
  .manual()
  .by('goto', async environment => {
    let page = await environment.newPage();

    await page.goto(WEBSITE_URL);

    return new TurningContext(page, USER_CONTEXT_A);
  });

turning
  .initialize([
    'website:home',
    'session:registered',
    'session:organization-created',
    'user:specified',
  ])
  .alias('goto home page (user A registered)')
  .by('goto', async environment => {
    let page = await environment.newPage();

    await page.goto(WEBSITE_URL);

    return new TurningContext(page, USER_CONTEXT_A);
  });
