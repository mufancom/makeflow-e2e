import getOrCreate from 'get-or-create';

import {getStateMatchingPatternsWithout, turning} from '../../../@turning';
import {transition} from '../../../@utils';

turning
  .turn(['0-0/app/primary/teams/default/procedures'], {
    match: {not: 'procedure-0-simple:created'},
  })
  .to([
    '0-0/app/primary/procedures/team-id/create',
    'procedure-0-simple:creating',
    'navigation-block-0-0:procedure-changed',
  ])
  .by(
    'clicking create procedure button',
    transition(async page => {
      await page.click('.create-procedure-button');
    }),
  );

turning
  .only()
  .turn(
    [
      '0-0/app/primary/procedures/team-id/create',
      'procedure-0-simple:creating',
      'navigation-block-0-0:procedure-changed',
    ],
    {
      pattern: false,
      match: getStateMatchingPatternsWithout('0-0', ['navigation-block']),
    },
  )
  .to([
    '0-0/app/primary/teams/default/procedures',
    'procedure-0-simple:created',
  ])
  .by(
    'clicking save procedure button',
    transition(async (page, data) => {
      let {displayName} = getOrCreate(data)
        .property('procedure', {})
        .property('simple', {displayName: `Simple Procedure ${Date.now()}`})
        .exec();

      await page.click('.procedure-display-name-text');

      await page.type('.procedure-display-name-input', displayName);

      await page.click('.save-procedure-button');
    }),
  );
