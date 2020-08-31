import {turning} from '../../@turning';
import {transition} from '../../@utils';

turning
  .turn([], {
    match: ['0-0/app/**', {not: 'organization-0:join-link-generated'}],
  })
  .to(['organization-0:join-link-generated', 'modal-0-0:invite-user'])
  .by(
    'clicking invite user button',
    transition(async (page, data) => {
      await page.click('.invite-user-button');

      await page.click('.invite-user-modal .label-by-link');

      await expect(page).toMatchElement('.copy-button:not(:disabled)', {
        timeout: 2000,
      });

      let joinLink = await page.evaluate(
        input => input.value as string,
        await page.$('.join-link-input'),
      );

      console.assert(/^https?:\/\//.test(joinLink));

      data.organization_0!.joinLink = joinLink;
    }),
  );
