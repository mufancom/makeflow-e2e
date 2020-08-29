import {turning} from '../../../@turning';

turning.define('/app');

turning.define('/app/primary/workbench').test(async ({page}) => {
  await page.waitFor('.workbench-view');
});

turning.define('/app/sidebar').test(async ({page}) => {
  await page.waitFor('#app > .sidebar');
});

turning.define('/app/sidebar/achievements').test(async ({page}) => {
  await page.waitFor('.expanded-sidebar .achievements');
});

turning.define('/app/sidebar/idea').test(
  async ({
    page,
    data: {
      idea: {active: activeIdeaTexts},
    },
  }) => {
    await page.waitFor('.expanded-sidebar .idea');

    for (let text of activeIdeaTexts) {
      await expect(page).toMatchElement('.idea-list-item', {text});
    }
  },
);

turning.define('/app/overlay');
