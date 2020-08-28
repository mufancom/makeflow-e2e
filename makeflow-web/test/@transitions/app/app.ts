import {turning} from '../../@turning';

turning
  .turn([
    '/app',
    '/app/**',
    'session:logged-in',
    'session:organization-selected',
  ])
  .to(['/website/login'])
  .alias('click app logout link')
  .manual()
  .by('clicking logout link', async ({page}) => {
    await expect(page).toClick('.header-menu .more');
    await expect(page).toClick('.header-menu-popup .logout-link');

    await page.waitForNavigation();
  });
