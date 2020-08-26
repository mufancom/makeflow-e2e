import {turning} from '../../@turning';

turning.define('app').test(async ({page}) => {
  await page.waitFor('#app > .sidebar');
});
