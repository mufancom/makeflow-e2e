const chromePaths = require('chrome-paths');

module.exports = {
  launch: {
    headless: !!process.env.CI,
    executablePath: chromePaths.chrome,
    defaultViewport: null,
    args: ['--disable-infobars'],
  },
};
