import {turning} from '../../../@turning';

turning.define('/app');

turning.define('/app/primary/workbench').test(async context => {
  let page = await context.getPage();

  await page.waitFor('.workbench-view');
});

turning.define('/app/sidebar').test(async context => {
  let page = await context.getPage();

  await page.waitFor('#app > .sidebar');
});

turning.define('/app/sidebar/achievements').test(async context => {
  let page = await context.getPage();

  await page.waitFor('.expanded-sidebar .achievements');
});

turning.define('/app/sidebar/idea').test(async context => {
  let page = await context.getPage();

  await page.waitFor('.expanded-sidebar .idea');

  for (let text of context.data.idea.active) {
    await expect(page).toMatchElement('.idea-list-item', {text});
  }
});

turning.define('/app/overlay');
