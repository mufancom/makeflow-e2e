import {createContext, generateRandomMobile} from './@utils';

export const USER_CONTEXT_A = createContext({
  account: {
    mobile: generateRandomMobile(),
    password: 'abc123',
  },
  organization: {
    name: '测试组织 A',
    size: '1 ~ 10人',
    industry: '其他',
  },
  user: {
    fullName: '福 Bar',
    username: 'fubar',
  },
});
