// Automatically generated turning types

type TurningPattern =
  | never;

type TurningState =
  | 'app'
  | 'app:*'
  | 'app:sidebar:*'
  | 'app:sidebar:achievements'
  | 'app:sidebar:default'
  | 'app:sidebar:idea'
  | 'app:workbench'
  | 'modal:*'
  | 'modal:create-task'
  | 'session:*'
  | 'session:logged-in'
  | 'session:organization-created'
  | 'session:organization-selected'
  | 'session:registered'
  | 'task:*'
  | 'task:create:*'
  | 'task:create:procedure-selected'
  | 'website:*'
  | 'website:home'
  | 'website:login'
  | 'website:sign-up:*'
  | 'website:sign-up:complete-user-profile'
  | 'website:sign-up:create-account'
  | 'website:sign-up:create-account:*'
  | 'website:sign-up:create-account:password-form'
  | 'website:sign-up:create-organization';

type TurningAlias =
  | 'goto home page'
  | 'goto home page (user A not registered)'
  | 'goto home page (user A registered)'
  | 'click app logout link'
  | 'transit to workbench'
  | 'click login button on home page'
  | 'submit login form'
  | 'click sign-up button on home page'
  | 'fill mobile to create account'
  | 'submit form to create account'
  | 'create organization'
  | 'complete user profile';
