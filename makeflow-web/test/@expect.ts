// tslint:disable: import-groups
import expect from 'expect';

(global as any).expect = expect;

import {setDefaultOptions} from 'expect-puppeteer';

setDefaultOptions({
  timeout: 1000,
});
