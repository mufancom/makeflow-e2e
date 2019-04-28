import {turning} from '../turning';

turning.define('app').test(async () => {
  await page.waitFor('#app > .header');
});

turning
  .turn(['app:*', 'session:logged-in', 'session:organization-selected'])
  .to(['website:login'])
  .alias('click app logout link')
  .manual()
  .by('clicking logout link', async () => {
    await expect(page).toClick('.header-menu');
    await expect(page).toClick('.ui-dropdown-item', {text: '退出登录'});
  });

export {};
