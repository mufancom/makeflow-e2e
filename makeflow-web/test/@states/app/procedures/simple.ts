import {turning} from '../../../@turning';
import {waitForSyncing} from '../../../@utils';

declare const _entrances: any;

turning.define('navigation-block:procedure-changed');

turning.define('procedure:simple:creating');

turning.define('procedure:simple:created').test(async ({page}) => {
  await waitForSyncing(page);

  let found = await page.evaluate(() => {
    return _entrances.syncableService.client
      .getObjects('procedure')
      .some((syncable: any) => syncable.displayName === 'Simple Procedure');
  });

  expect(found).toBe(true);
});
