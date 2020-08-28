import _ from 'lodash';

import {turning} from '../../@turning';

turning.define('/app/workbench').test(async ({page}) => {
  await page.waitFor('.workbench-view');
});
