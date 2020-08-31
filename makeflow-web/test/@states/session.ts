import {turning} from '../@turning';

turning.define('organization-0:created');
turning.define('organization-0:join-link-generated');

// active user

turning.define('context:0-0');
turning.define('context:0-1');

// user-[organization-id]-[user-id]

turning.define('user-0-0:registered');
turning.define('user-0-0:logged-in');
turning.define('user-0-0:organization-selected');

turning.define('user-0-1:pending-join');
turning.define('user-0-1:registered');
turning.define('user-0-1:logged-in');
turning.define('user-0-1:organization-selected');
