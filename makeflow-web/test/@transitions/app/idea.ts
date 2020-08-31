import {lorem} from 'faker';
import getOrCreate from 'get-or-create';

import {turning} from '../../@turning';
import {transition, waitForSyncing} from '../../@utils';

turning
  .turn([], {
    match: '0-0/app/sidebar/idea',
  })
  .to([])
  .by(
    'creating a new idea',
    transition(async (page, data) => {
      let text = lorem.sentence();

      await page.type('.idea-list .idea-list-new-item input', `${text}\n`);

      await waitForSyncing(page);

      let {active: activeIdeaTexts} = getOrCreate(data)
        .property('idea', {active: []})
        .exec();

      activeIdeaTexts.push(text);
    }),
  );
