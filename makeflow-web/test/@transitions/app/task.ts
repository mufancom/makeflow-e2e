import {turning} from '../../@turning';

turning
  .turn([], {
    match: ['/app/workbench', {not: 'modal:create-task'}],
  })
  .to(['modal:create-task'])
  .by('clicking "+" on workbench', async ({page}) => {
    // Due to unknown reasons, `page.click()` and `expect(page).toClick()` are
    // not stable here. Might be result of re-rendering.

    await page.$eval('.create-task-button', button => button.click());
  });

turning
  .turn([], {
    pattern: false,
    match: 'modal:create-task',
  })
  .to(['task:create:procedure-selected'])
  .by('doing nothing', async () => {});
