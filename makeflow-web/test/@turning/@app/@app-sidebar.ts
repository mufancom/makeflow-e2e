import {turning} from '../turning';

turning.define('app:sidebar:default').test(async () => {
  await page.waitFor('.sidebar');
});

turning.define('app:sidebar:achievements').test(async () => {
  await page.waitFor('.expanded-sidebar .achievements');
});

turning.define('app:sidebar:idea').test(async () => {
  await page.waitFor('.expanded-sidebar .idea');
});

turning
  .turn(['app:sidebar:*'], {
    match: {not: 'app:sidebar:achievements'},
  })
  .to(['app:sidebar:achievements'])
  .by('clicking sidebar user avatar', async () => {
    await page.click('.normal-sidebar-nav-link.achievements-link');
  });

turning
  .turn(['app:sidebar:achievements'])
  .to(['app:sidebar:default'])
  .by('clicking sidebar user avatar', async () => {
    await page.click('.normal-sidebar-nav-link.achievements-link');
  });

turning
  .turn(['app:sidebar:*'], {
    match: {not: 'app:sidebar:idea'},
  })
  .to(['app:sidebar:idea'])
  .by('clicking sidebar idea link', async () => {
    await page.click('.normal-sidebar-nav-link.idea-link');
  });

turning
  .turn(['app:sidebar:idea'])
  .to(['app:sidebar:default'])
  .by('clicking sidebar idea link', async () => {
    await page.click('.normal-sidebar-nav-link.idea-link');
  });
