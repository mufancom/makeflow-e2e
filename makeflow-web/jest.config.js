const merge = require('merge');

module.exports = merge(
  require('ts-jest/jest-preset'),
  require('jest-puppeteer/jest-preset'),
  {
    globals: {
      'ts-jest': {
        tsConfig: '<rootDir>/test/tsconfig.json',
      },
    },
  },
);
