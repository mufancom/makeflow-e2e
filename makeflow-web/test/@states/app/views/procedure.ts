import {turning} from '../../../@turning';

turning.define('/app/teams/teams-id/procedures').test(async ({page}) => {
  await expect(page).toMatchElement('.team-procedures-view');
});
