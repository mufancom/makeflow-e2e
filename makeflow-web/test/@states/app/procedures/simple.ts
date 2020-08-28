import {turning} from '../../../@turning';

declare const _entrances: any;

turning.define('procedure:simple:created').test(async ({page}) => {
  let found = await page.evaluate(() => {
    return _entrances.syncableService.client
      .getObjects('procedure')
      .some((syncable: any) => syncable.displayName === 'Simple Procedure');
  });

  expect(found).toBe(true);
});
