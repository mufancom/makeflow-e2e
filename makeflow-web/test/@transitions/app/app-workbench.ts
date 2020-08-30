import _ from 'lodash';

import {APP_WORKBENCH_URL} from '../../@constants';
import {turning} from '../../@turning';

turning
  .spawn(['/app'])
  .to(['/app/primary/workbench', '/app/sidebar', '/app/overlay'])
  .by('goto "/app/workbench"', async context => {
    let page = await context.createPage();

    await page.goto(APP_WORKBENCH_URL);

    return context;
  });

turning
  .turn(['/app'], {
    match: {not: '/app/**'},
  })
  .to(['/app/primary/workbench', '/app/sidebar', '/app/overlay'])
  .alias('transit to workbench')
  .manual()
  .by('doing nothing', () => {});
