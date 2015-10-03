/* eslint-env node */

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
    'SL_InternetExplorer20': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '20'
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
      'src/**/*.js',
      'tests/unit/browser/**/*.js'
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
