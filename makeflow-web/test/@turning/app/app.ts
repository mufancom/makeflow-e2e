import {turning} from '../turning';

turning.define('app').test(async ({page}) => {
  await page.waitFor('#app > .sidebar');
});

turning
  .turn(['app', 'app:*', 'session:logged-in', 'session:organization-selected'])
  .to(['website:login'])
  .alias('click app logout link')
  .manual()
  .by('clicking logout link', async ({page}) => {
    await expect(page).toClick('.header-menu .more');
    await expect(page).toClick('.ui-dropdown-item', {text: '退出登录'});

    await page.waitForNavigation();
  });
