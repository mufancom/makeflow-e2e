import {turning} from '../turning';

turning.define('app:sidebar:default').test(async ({page}) => {
  await page.waitFor('.sidebar');
});

turning.define('app:sidebar:achievements').test(async ({page}) => {
  await page.waitFor('.expanded-sidebar .achievements');
});

turning
  .turn(['app:sidebar:*'], {
    match: {not: 'app:sidebar:achievements'},
  })
  .to(['app:sidebar:achievements'])
  .by('clicking sidebar user avatar', async ({page}) => {
    await page.click('.normal-sidebar-nav-link.achievements-link');
  });

turning
  .turn(['app:sidebar:achievements'])
  .to(['app:sidebar:default'])
  .by('clicking sidebar user avatar', async ({page}) => {
    await page.click('.normal-sidebar-nav-link.achievements-link');
  });
