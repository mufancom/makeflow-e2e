import {turning} from '../../@turning';

turning.define('modal-0-0:create-task').test(async context => {
  let page = await context.getPage('0-0');

  await expect(page).toMatchElement('.create-task-modal');
});

turning
  .define('modal-0-0:create-task:procedure-selected')
  .test(async context => {
    let page = await context.getPage('0-0');

    await expect(page).toMatchElement(
      '.create-task-modal .procedure-tag.active',
    );
  });

turning.define('modal-0-0:invite-user').test(async context => {
  let page = await context.getPage('0-0');

  await expect(page).toMatchElement('.invite-member-modal');
});

turning.define('modal-0-1:placeholder');
