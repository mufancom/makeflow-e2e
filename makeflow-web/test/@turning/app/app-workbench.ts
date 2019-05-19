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
  .by('clicking header logo', async ({page, ...restContext}) => {
    await page.evaluate(`
      _history.push('/app');
    `);

    return {
      page,
      ..._.cloneDeep(restContext),
    };
  });
