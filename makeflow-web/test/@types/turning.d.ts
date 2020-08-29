// Automatically generated turning types

interface TurningGenericParams {
  pattern:
    | never;
  state:
    | '/app'
    | '/app/overlay'
    | '/app/primary/procedures/team-id/create'
    | '/app/primary/teams/default/procedures'
    | '/app/primary/workbench'
    | '/app/sidebar'
    | '/app/sidebar/achievements'
    | '/app/sidebar/idea'
    | '/website/home'
    | '/website/login'
    | '/website/sign-up/complete-user-profile'
    | '/website/sign-up/create-account'
    | '/website/sign-up/create-account/password-form'
    | '/website/sign-up/create-organization'
    | 'modal:create-task'
    | 'navigation-block:procedure-changed'
    | 'procedure:simple:created'
    | 'procedure:simple:creating'
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
    | '/app/overlay'
    | '/app/primary/*'
    | '/app/primary/**'
    | '/app/primary/procedures/*'
    | '/app/primary/procedures/**'
    | '/app/primary/procedures/team-id/*'
    | '/app/primary/procedures/team-id/**'
    | '/app/primary/procedures/team-id/create'
    | '/app/primary/procedures/team-id{,/**}'
    | '/app/primary/procedures{,/**}'
    | '/app/primary/teams/*'
    | '/app/primary/teams/**'
    | '/app/primary/teams/default/*'
    | '/app/primary/teams/default/**'
    | '/app/primary/teams/default/procedures'
    | '/app/primary/teams/default{,/**}'
    | '/app/primary/teams{,/**}'
    | '/app/primary/workbench'
    | '/app/primary{,/**}'
    | '/app/sidebar'
    | '/app/sidebar/*'
    | '/app/sidebar/**'
    | '/app/sidebar/achievements'
    | '/app/sidebar/idea'
    | '/app/sidebar{,/**}'
    | '/app{,/**}'
    | '/website/*'
    | '/website/**'
    | '/website/home'
    | '/website/login'
    | '/website/sign-up/*'
    | '/website/sign-up/**'
    | '/website/sign-up/complete-user-profile'
    | '/website/sign-up/create-account'
    | '/website/sign-up/create-account/*'
    | '/website/sign-up/create-account/**'
    | '/website/sign-up/create-account/password-form'
    | '/website/sign-up/create-account{,/**}'
    | '/website/sign-up/create-organization'
    | '/website/sign-up{,/**}'
    | '/website{,/**}'
    | 'modal:**'
    | 'modal:create-task'
    | 'navigation-block:**'
    | 'navigation-block:procedure-changed'
    | 'procedure:**'
    | 'procedure:simple:**'
    | 'procedure:simple:created'
    | 'procedure:simple:creating'
    | 'session:**'
    | 'session:logged-in'
    | 'session:organization-created'
    | 'session:organization-selected'
    | 'session:registered'
    | 'task:**'
    | 'task:create:**'
    | 'task:create:procedure-selected'
    | '{,/**}';
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
