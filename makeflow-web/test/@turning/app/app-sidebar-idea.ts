import _ from 'lodash';

import {waitForSyncing} from '../../@utils';
import {turning} from '../turning';

turning
  .define('app:sidebar:idea')
  .test(async ({idea: {active: activeIdeaTexts}}) => {
    await page.waitFor('.expanded-sidebar .idea');

    for (let text of activeIdeaTexts) {
      await expect(page).toMatchElement('.idea-list-item', {text});
    }
  });

turning
  .turn(['app:sidebar:*'], {
    match: {not: 'app:sidebar:idea'},
  })
  .to(['app:sidebar:idea'])
  .by('clicking sidebar idea link', async () => {
    await page.click('.normal-sidebar-nav-link.idea-link');
  });

turning
  .turn(['app:sidebar:idea'])
  .to(['app:sidebar:default'])
  .by('clicking sidebar idea link', async () => {
    await page.click('.normal-sidebar-nav-link.idea-link');
  });

turning
  .turn([], {
    match: 'app:sidebar:idea',
  })
  .to([])
  .by('creating a new idea', async context => {
    context = _.cloneDeep(context);

    let text = `这是一个忧伤的故事 ${Math.random()}`;

    await page.type('.idea-list > .idea-list-new-item input', `${text}\n`);

    await waitForSyncing(page);

    context.idea = context.idea || {activeIdeas: []};

    context.idea.active.push(text);

    return context;
  });

export const __ = undefined;
