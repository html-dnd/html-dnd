/* eslint-env node */
require('dotenv').config({silent: true});

module.exports = function(config) {
  // Example set of browsers to run on Sauce Labs
  // Check out https://saucelabs.com/platforms for all browser/platform combos
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'SL_FireFox': {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    'SL_Safari': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11'
    },
    'SL_Edge': {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10'
    },
    'SL_InternetExplorer11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    },
    'SL_InternetExplorer10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9'
    }
  };

  config.set({
    basePath: '',
    files: [
      'dist/**/*.js',
      'test/unit/browser/**/*.js'
    ],
    exclude: [],
    frameworks: ['mocha', 'chai'],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    sauceLabs: {
      testName: 'html-dnd Unit Tests'
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['mocha', 'coverage', 'saucelabs']
  });
};
