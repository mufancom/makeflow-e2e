import {turning} from '../../../@turning';
import {waitForRouting} from '../../../@utils';

declare const _entrances: any;

turning.define('navigation-block:procedure-changed');

turning.define('procedure:simple:creating');

turning.define('procedure:simple:created').test(async context => {
  let page = await context.getPage();

  await waitForRouting(page);

  let found = await page.evaluate(displayName => {
    return _entrances.syncableService.client
      .getObjects('procedure')
      .some((syncable: any) => syncable.displayName === displayName);
  }, context.data.procedure!.simple!.displayName);

  expect(found).toBe(true);
});
