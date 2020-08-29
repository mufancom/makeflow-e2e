import {lorem} from 'faker';
import _ from 'lodash';

import {turning} from '../../@turning';
import {waitForSyncing} from '../../@utils';

turning
  .turn(['/app/sidebar{,/**}'], {
    match: {not: '/app/sidebar/achievements'},
  })
  .to(['/app/sidebar/achievements'])
  .by('clicking sidebar user avatar', async ({page}) => {
    await page.click('.normal-sidebar-nav-link.achievements-link');
  });

turning
  .turn(['/app/sidebar/achievements'])
  .to(['/app/sidebar'])
  .by('clicking sidebar user avatar', async ({page}) => {
    await page.click('.normal-sidebar-nav-link.achievements-link');
  });

turning
  .turn(['/app/sidebar{,/**}'], {
    match: {not: '/app/sidebar/idea'},
  })
  .to(['/app/sidebar/idea'])
  .by('clicking sidebar idea link', async ({page}) => {
    await page.click('.normal-sidebar-nav-link.idea-link');
  });

turning
  .turn(['/app/sidebar/idea'])
  .to(['/app/sidebar'])
  .by('clicking sidebar idea link', async ({page}) => {
    await page.click('.normal-sidebar-nav-link.idea-link');
  });

turning
  .turn([], {
    match: '/app/sidebar/idea',
  })
  .to([])
  .by('creating a new idea', async context => {
    let {page, data} = context;

    let text = lorem.sentence();

    await page.type('.idea-list .idea-list-new-item input', `${text}\n`);

    await waitForSyncing(page);

    data.idea = data.idea || {activeIdeas: []};

    data.idea.active.push(text);
  });
