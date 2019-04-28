import {turning} from './@turning';

jest.setTimeout(20000);

turning.case('register user A', [
  'goto home page (user A not registered)',
  'click sign-up button on home page',
  'fill mobile to create account',
  'submit form to create account',
  'create organization',
  'complete user profile',
]);

turning.case('logout user A from workbench', [
  'goto home page (user A registered)',
  'click login button on home page',
  'submit login form',
  'restore app workbench page',
  'click app logout link',
]);

turning.test();
