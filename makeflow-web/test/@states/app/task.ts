import {turning} from '../../@turning';

turning.define('modal:create-task').test(async ({page}) => {
  await expect(page).toMatchElement('.create-task-modal');
});

turning.define('task:create:procedure-selected').test(async ({page}) => {
  await expect(page).toMatchElement('.create-task-modal .procedure-tag.active');
});
