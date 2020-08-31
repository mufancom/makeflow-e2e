import {turning} from '../../@turning';
import {transition} from '../../@utils';

turning
  .turn(['modal-0-0:**'], {
    pattern: '0-0-modal',
  })
  .to([])
  .by(
    'clicking close button / mask / document',
    transition(async page => {
      await page.click(
        '.ui-modal .close-button, .ui-modal-mask, #app .header-nav',
      );

      await expect(page).not.toMatchElement('.ui-modal');
    }),
  );
