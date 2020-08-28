import _ from 'lodash';

import {turning} from '../../@turning';

declare const _entrances: any;

turning.define('/app/workbench').test(async ({page}) => {
  await page.waitFor('.workbench-view');
});

turning
  .spawn([], {
    match: ['/app', {not: '/app/**'}],
  })
  .to(['/app/workbench', '/app/sidebar/default'])
  .by('pushing "/app"', async ({page}) => {
    await page.evaluate(async () => {
      await _entrances.history.push('/app');
    });
  });

turning
  .turn([], {
    match: ['/app', {not: '/app/**'}],
  })
  .to(['/app/workbench', '/app/sidebar/default'])
  .alias('transit to workbench')
  .manual()
  .by('doing nothing', () => {});
