import {turning} from '../../../@turning';
import {waitForRouting} from '../../../@utils';

declare const _entrances: any;

turning.define('navigation-block-0-0:procedure-changed');

turning.define('procedure-0-simple:creating');

turning.define('procedure-0-simple:created').test(async context => {
  let page = await context.getPage('0-0');

  await waitForRouting(page);

  let found = await page.evaluate(displayName => {
    return _entrances.syncableService.client
      .getObjects('procedure')
      .some((syncable: any) => syncable.displayName === displayName);
  }, context.data.procedure!.simple!.displayName);

  expect(found).toBe(true);
});
