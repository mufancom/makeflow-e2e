import {turning} from './turning';

turning.define('modal:create-task').test(async ({page}) => {
  await expect(page).toMatchElement('.create-task-modal');
});

turning.define('task:create:procedure-selected').test(async ({page}) => {
  await expect(page).toMatchElement('.create-task-modal .procedure-tag.active');
});

turning
  .turn([], {
    match: ['app:workbench', {not: 'modal:create-task'}],
  })
  .to(['modal:create-task'])
  .by('clicking "+" on workbench', async ({page}) => {
    // Due to unknown reasons, `page.click()` and `expect(page).toClick()` are
    // not stable here. Might be result of re-rendering.

    await page.$eval('.create-task-button button', button => button.click());
  });

turning
  .turn([], {
    pattern: false,
    match: 'modal:create-task',
  })
  .to(['task:create:procedure-selected'])
  .by('doing nothing (default)', async () => {});

turning
  .turn([], {
    pattern: false,
    match: 'modal:create-task',
  })
  .to(['task:create:procedure-selected'])
  .by('select the second procedure', async ({page}) => {
    await expect(page).toClick(
      '.create-task-modal .procedure-tag:nth-child(2)',
    );
  });
