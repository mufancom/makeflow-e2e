import {turning} from '../../@turning';

turning.define('modal:create-task').test(async context => {
  let page = await context.getPage();

  await expect(page).toMatchElement('.create-task-modal');
});

turning.define('task:create:procedure-selected').test(async context => {
  let page = await context.getPage();

  await expect(page).toMatchElement('.create-task-modal .procedure-tag.active');
});
