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
      matches: getStateMatchingPatternsWithout(['navigation-block']),
    },
  )
  .to(['/app/primary/teams/default/procedures', 'procedure:simple:created'])
  .by('clicking save procedure button', async ({page}) => {
    await page.click('.procedure-display-name-text');

    await page.type('.procedure-display-name-input', 'Simple Procedure');

    await page.click('.save-procedure-button');
  });
