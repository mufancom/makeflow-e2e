import _ from 'lodash';

import {APP_WORKBENCH_URL} from '../../@constants';
import {TurningContext, turning} from '../../@turning';

turning
  .spawn(['/app'])
  .to(['/app/primary/workbench', '/app/sidebar'])
  .by('goto "/app/workbench"', async (context, environment) => {
    let page = await environment.newPage();

    await page.goto(APP_WORKBENCH_URL);

    return new TurningContext(page, _.cloneDeep(context.data));
  });

turning
  .turn(['/app'], {
    match: {not: '/app/**'},
  })
  .to(['/app/primary/workbench', '/app/sidebar'])
  .alias('transit to workbench')
  .manual()
  .by('doing nothing', () => {});
