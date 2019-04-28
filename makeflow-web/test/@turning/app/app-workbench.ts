import _ from 'lodash';

import {turning} from '../turning';

turning.define('app:workbench').test(async () => {
  await page.waitFor('.workbench-view');
});

turning
  .spawn(['app'])
  .to(['app:workbench', 'app:sidebar:default'])
  .by('clicking header logo', async context => {
    await page.click('.header-logo');

    return _.cloneDeep(context);
  });

turning
  .turn(['app'])
  .to(['app:workbench', 'app:sidebar:default'])
  .alias('restore app workbench page')
  .manual()
  .by('clicking header logo', async context => {
    await page.click('.header-logo');

    return _.cloneDeep(context);
  });

export {};
