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
    await page.click('.header-logo');

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
  .alias('restore app workbench page')
  .manual()
  .by('clicking header logo', async ({page, ...restContext}) => {
    await page.click('.header-logo');

    return {
      page,
      ..._.cloneDeep(restContext),
    };
  });
