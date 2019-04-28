import {WEBSITE_LOGOUT_URL, WEBSITE_URL} from '../../@urls';
import {USER_CONTEXT_A} from '../../@users';
import {createContext} from '../../@utils';
import {turning} from '../turning';

turning.define('website:home').test(async () => {
  await page.waitFor('.home-view');
});

turning
  .initialize(['website:home'])
  .alias('goto home page')
  .by('goto', async () => {
    await page.goto(WEBSITE_LOGOUT_URL);
    await page.goto(WEBSITE_URL);

    return createContext();
  });

turning
  .initialize(['website:home'])
  .alias('goto home page (user A not registered)')
  .manual()
  .by('goto', async () => {
    await page.goto(WEBSITE_LOGOUT_URL);
    await page.goto(WEBSITE_URL);

    return USER_CONTEXT_A;
  });

turning
  .initialize([
    'website:home',
    'session:registered',
    'session:organization-created',
    'user:specified',
  ])
  .alias('goto home page (user A registered)')
  .by('goto', async () => {
    await page.goto(WEBSITE_LOGOUT_URL);
    await page.goto(WEBSITE_URL);

    return USER_CONTEXT_A;
  });

export {};
