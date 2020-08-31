import {turning} from '../../../@turning';

turning
  .define('0-0/app/primary/teams/default/procedures')
  .test(async context => {
    let page = await context.getPage('0-0');

    await expect(page).toMatchElement('.team-procedures-view');
  });

turning
  .define('0-0/app/primary/procedures/team-id/create')
  .test(async context => {
    let page = await context.getPage('0-0');

    await expect(page).toMatchElement('.procedure-editor-view.create-mode', {
      timeout: 2000,
    });
  });
