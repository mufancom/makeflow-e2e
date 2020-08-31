import {turning} from '../../@turning';
import {transition} from '../../@utils';

turning
  .turn([], {
    match: ['0-0/app/primary/workbench', {not: 'modal-0-0:create-task{,:**}'}],
  })
  .to(['modal-0-0:create-task'])
  .by(
    'clicking "+" on workbench',
    transition(async page => {
      // Due to unknown reasons, `page.click()` and `expect(page).toClick()` are
      // not stable here. Might be result of re-rendering.

      await page.$eval('.create-task-button', button => button.click());
    }),
  );

turning
  .turn([], {
    pattern: '0-0-modal',
    match: 'modal-0-0:create-task',
  })
  .to(['modal-0-0:create-task:procedure-selected'])
  .by('doing nothing', async () => {});

turning
  .turn(['modal-0-0:create-task{,:**}'], {
    pattern: '0-0-modal',
  })
  .to([])
  .by(
    'clicking document',
    transition(async page => {
      await page.click('#app');
    }),
  );
