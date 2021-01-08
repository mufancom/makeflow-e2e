import _ from 'lodash';

import {APP_WORKBENCH_URL} from '../../@constants';
import {turning} from '../../@turning';
import {getUserIdFromStates, transition} from '../../@utils';

turning
  .spawn(['0-0/app'])
  .to(['0-0/app/primary/workbench', '0-0/app/sidebar', '0-0/app/overlay'])
  .by('goto "/app/workbench"', async (context, _environment, states) => {
    let page = await context.createPage(getUserIdFromStates(states));

    await page.goto(APP_WORKBENCH_URL);

    if (context.session.account_0?.preSale) {
      await page.waitFor('.ui-modal', {
        timeout: 2000,
      });

      await page.click('.ui-modal .close-button');

      context.session.account_0.preSale = false;
    }

    return context;
  });

turning
  .turn(['0-0/app'], {
    match: {not: '0-0/app/**'},
  })
  .to(['0-0/app/primary/workbench', '0-0/app/sidebar', '0-0/app/overlay'])
  .alias('transit to workbench')
  .manual()
  .by('doing nothing', () => {});

turning
  .turn(['0-0/app/**', 'user-0-0:logged-in', 'user-0-0:organization-selected'])
  .to(['0-0/website/login'])
  .alias('click app logout link')
  .manual()
  .by(
    'clicking logout link',
    transition(async page => {
      await expect(page).toClick('.header-menu .more');
      await expect(page).toClick('.header-menu-popup .logout-link');

      await page.waitForNavigation();
    }),
  );
