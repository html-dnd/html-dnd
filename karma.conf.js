/* eslint-env node */

module.exports = function(config) {
  config.set({
    basePath: '',
    files: [
      'src/**/*.js',
      'test/unit/browser/**/*.js'
    ],
    exclude: [],
    frameworks: ['mocha', 'chai'],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    singleRun: true,
    browsers: ['Chrome', 'Firefox'],
    reporters: ['dots', 'coverage']
  });
};
