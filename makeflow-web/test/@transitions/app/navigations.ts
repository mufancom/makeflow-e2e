import {turning} from '../../@turning';
import {transition} from '../../@utils';

turning
  .turn(['0-0/app/sidebar{,/**}'], {
    match: {not: '0-0/app/sidebar/achievements'},
  })
  .to(['0-0/app/sidebar/achievements'])
  .by(
    'clicking sidebar user avatar',
    transition(async page => {
      await page.click('.normal-sidebar-nav-link.achievements-link');
    }),
  );

turning
  .turn(['0-0/app/sidebar/achievements'])
  .to(['0-0/app/sidebar'])
  .by(
    'clicking sidebar user avatar',
    transition(async page => {
      await page.click('.normal-sidebar-nav-link.achievements-link');
    }),
  );

turning
  .turn(['0-0/app/sidebar{,/**}'], {
    match: {not: '0-0/app/sidebar/idea'},
  })
  .to(['0-0/app/sidebar/idea'])
  .by(
    'clicking sidebar idea link',
    transition(async page => {
      await page.click('.normal-sidebar-nav-link.idea-link');
    }),
  );

turning
  .turn(['0-0/app/sidebar/idea'])
  .to(['0-0/app/sidebar'])
  .by(
    'clicking sidebar idea link',
    transition(async page => {
      await page.click('.normal-sidebar-nav-link.idea-link');
    }),
  );

turning
  .turn(['0-0/app/**'])
  .to([
    '0-0/app/primary/teams/default/procedures',
    '0-0/app/sidebar',
    '0-0/app/overlay',
  ])
  .by(
    'clicking header menu procedure management link',
    transition(async page => {
      await expect(page).toClick('.header-menu .more');
      await expect(page).toClick(
        '.header-menu-popup .procedure-management-link',
      );
    }),
  );
