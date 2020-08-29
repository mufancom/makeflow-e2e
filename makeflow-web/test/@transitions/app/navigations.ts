import {turning} from '../../@turning';

turning
  .turn(['/app/**'])
  .to(['/app/primary/teams/default/procedures', '/app/sidebar', '/app/overlay'])
  .by('clicking header menu procedure management link', async ({page}) => {
    await expect(page).toClick('.header-menu .more');
    await expect(page).toClick('.header-menu-popup .procedure-management-link');
  });
