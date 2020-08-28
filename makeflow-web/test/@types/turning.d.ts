// Automatically generated turning types

interface TurningGenericParams {
  pattern:
    | never;
  state:
    | '/app'
    | '/app/sidebar/achievements'
    | '/app/sidebar/default'
    | '/app/sidebar/idea'
    | '/app/teams/teams-id/procedures'
    | '/app/workbench'
    | '/website/home'
    | '/website/login'
    | '/website/sign-up/complete-user-profile'
    | '/website/sign-up/create-account'
    | '/website/sign-up/create-account/password-form'
    | '/website/sign-up/create-organization'
    | 'modal:create-task'
    | 'procedure:simple:created'
    | 'session:logged-in'
    | 'session:organization-created'
    | 'session:organization-selected'
    | 'session:registered'
    | 'task:create:procedure-selected';
  statePattern:
    | '/*'
    | '/**'
    | '/app'
    | '/app/*'
    | '/app/**'
    | '/app/sidebar/*'
    | '/app/sidebar/achievements'
    | '/app/sidebar/default'
    | '/app/sidebar/idea'
    | '/app/teams/**'
    | '/app/teams/teams-id/*'
    | '/app/teams/teams-id/procedures'
    | '/app/workbench'
    | '/website/*'
    | '/website/**'
    | '/website/home'
    | '/website/login'
    | '/website/sign-up/*'
    | '/website/sign-up/**'
    | '/website/sign-up/complete-user-profile'
    | '/website/sign-up/create-account'
    | '/website/sign-up/create-account/*'
    | '/website/sign-up/create-account/password-form'
    | '/website/sign-up/create-organization'
    | 'modal:*'
    | 'modal:create-task'
    | 'procedure:*'
    | 'procedure:simple:*'
    | 'procedure:simple:created'
    | 'session:*'
    | 'session:logged-in'
    | 'session:organization-created'
    | 'session:organization-selected'
    | 'session:registered'
    | 'task:*'
    | 'task:create:*'
    | 'task:create:procedure-selected';
  initializeAlias:
    | 'goto home page'
    | 'goto home page (user A not registered)'
    | 'goto home page (user A registered)';
  transitionAlias:
    | 'click app logout link'
    | 'transit to workbench'
    | 'click login button on home page'
    | 'submit login form'
    | 'click sign-up button on home page'
    | 'fill mobile to create account'
    | 'submit form to create account'
    | 'create organization'
    | 'complete user profile';
}
