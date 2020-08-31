import {turning} from '../../../@turning';

turning.define('0-0/app');

turning.define('0-0/app/primary/workbench').test(async context => {
  let page = await context.getPage('0-0');

  await page.waitFor('.workbench-view');
});

turning.define('0-0/app/sidebar').test(async context => {
  let page = await context.getPage('0-0');

  await page.waitFor('#app > .sidebar');
});

turning.define('0-0/app/sidebar/achievements').test(async context => {
  let page = await context.getPage('0-0');

  await page.waitFor('.expanded-sidebar .achievements');
});

turning.define('0-0/app/sidebar/idea').test(async context => {
  let page = await context.getPage('0-0');

  await page.waitFor('.expanded-sidebar .idea');

  for (let text of context.data.idea?.active ?? []) {
    await expect(page).toMatchElement('.idea-list-item', {text});
  }
});

turning.define('0-0/app/overlay');
