import {turning} from '../../@turning';

turning.define('app:sidebar:default').test(async ({page}) => {
  await page.waitFor('.sidebar');
});

turning.define('app:sidebar:achievements').test(async ({page}) => {
  await page.waitFor('.expanded-sidebar .achievements');
});

turning.define('app:sidebar:idea').test(
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
