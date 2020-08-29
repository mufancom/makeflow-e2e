import getOrCreate from 'get-or-create';

import {getStateMatchingPatternsWithout, turning} from '../../../@turning';

turning
  .turn(['/app/primary/teams/default/procedures'], {
    match: {not: 'procedure:simple:created'},
  })
  .to([
    '/app/primary/procedures/team-id/create',
    'procedure:simple:creating',
    'navigation-block:procedure-changed',
  ])
  .by('clicking create procedure button', async ({page}) => {
    await page.click('.create-procedure-button');
  });

turning
  .turn(
    [
      '/app/primary/procedures/team-id/create',
      'procedure:simple:creating',
      'navigation-block:procedure-changed',
    ],
    {
      pattern: false,
      match: getStateMatchingPatternsWithout(['navigation-block']),
    },
  )
  .to(['/app/primary/teams/default/procedures', 'procedure:simple:created'])
  .by('clicking save procedure button', async ({page, data}) => {
    let {displayName} = getOrCreate(data)
      .property('procedure', {})
      .property('simple', {displayName: `Simple Procedure ${Date.now()}`})
      .exec();

    await page.click('.procedure-display-name-text');

    await page.type('.procedure-display-name-input', displayName);

    await page.click('.save-procedure-button');
  });
