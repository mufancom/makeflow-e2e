const {ENVIRONMENT, PORT = '8060'} = process.env;

const HOST = ENVIRONMENT === 'e2e' ? 'makeflow-web-server' : 'localhost';

export const BASE_URL = `http://${HOST}:${PORT}`;

/////////////
// Website //
/////////////

export const WEBSITE_URL = BASE_URL;

export const WEBSITE_REGISTER_URL = `${WEBSITE_URL}/sign-up/create-account`;

export const WEBSITE_LOGIN_URL = `${WEBSITE_URL}/login`;

export const WEBSITE_LOGOUT_URL = `${WEBSITE_URL}/logout`;

/////////
// App //
/////////

export const APP_URL = `${BASE_URL}/app`;

export const APP_WORKBENCH_URL = `${APP_URL}/workbench`;

/////////
// API //
/////////

export const API_URL = `${BASE_URL}/api`;

export const API_E2E_URL = `${API_URL}/e2e`;

export const API_E2E_GET_VERIFICATION_CODE_URL = `${API_E2E_URL}/get-verification-code`;
