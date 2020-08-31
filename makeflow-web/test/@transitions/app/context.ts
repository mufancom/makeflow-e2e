import {turning} from '../../@turning';

turning
  .turn(['context:0-0'], {
    pattern: '0-0-to-0-1',
    match: ['organization-0:join-link-generated', {not: '0-1/**'}],
  })
  .to(['context:0-1', 'user-0-1:pending-join', '0-1/website/join'])
  .by('creating a new page under different context', async context => {
    let page = await context.createPage('0-1');

    await page.goto(context.data.organization_0!.joinLink!);
  });
