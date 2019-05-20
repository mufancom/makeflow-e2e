import _ from 'lodash';

import {turning} from '../turning';

turning.define('app:workbench').test(async ({page}) => {
  await page.waitFor('.workbench-view');
});

turning
  .spawn([], {
    match: ['app', {not: 'app:*'}],
  })
  .to(['app:workbench', 'app:sidebar:default'])
  .by('pushing "/app"', async ({page, ...restContext}) => {
    await page.evaluate(`
      _history.push('/app');
    `);

    return {
      page,
      ..._.cloneDeep(restContext),
    };
  });

turning
  .turn([], {
    match: ['app', {not: 'app:*'}],
  })
  .to(['app:workbench', 'app:sidebar:default'])
  .alias('transit to workbench')
  .manual()
  .by('doing nothing', () => {});
