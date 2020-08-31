import {TurningContextData} from './@turning';
import {generateRandomMobile} from './@utils';

export const SESSION_CONTEXT_A: TurningContextData = {
  account_0: {
    mobile: generateRandomMobile(),
    password: 'abc123',
    user_0: {
      fullName: '福 Bar',
      username: 'fubar',
    },
  },
  organization_0: {
    displayName: '测试组织 A',
    size: '1 ~ 10人',
    industry: '其他',
  },
};
