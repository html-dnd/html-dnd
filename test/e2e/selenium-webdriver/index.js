var dragAndDrop = require('../../../lib/index.js');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;

var TEST_PAGE_URL = 'https://kuniwak.github.io/html-dnd/test.html';
var SAUCELABS_URL = 'http://ondemand.saucelabs.com:80/wd/hub';

var util = require('util');
var lodash = require('lodash');
var assert = require('chai').assert;
var testing = require('selenium-webdriver/testing');
var describe = testing.describe;
var before = testing.before;
var after = testing.after;
var it = testing.it;

require('dotenv').config({silent: true});

var BASE_CAPABILITY = {
  name: 'html-dnd E2E Tests',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY
};

var Capabilities = [
  {
    browserName: 'chrome',
    platform: 'Linux'
  },
  {
    browserName: 'firefox',
    platform: 'Linux'
  },
  {
    browserName: 'safari',
    platform: 'OS X 10.10'
  },
  {
    browserName: 'microsoftedge',
    platform: 'Windows 10'
  },
  {
    browserName: 'internet explorer',
    platform: 'Windows 8.1'
  },
  {
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9.0'
  }
].map(function(capability) {
  return lodash.extend({}, BASE_CAPABILITY, capability);
});

describe('html-dnd', function() {
  Capabilities.forEach(function(capability) {
    var testCaseName = util.format(
      'on %s %s (%s)',
      capability.browserName,
      capability.version || 'latest',
      capability.platform
    );

    describe(testCaseName, function() {
      var driver;

      before(function() {
        driver = new webdriver.Builder().
          usingServer(SAUCELABS_URL).
          withCapabilities(capability).
          build();
      });

      describe('.code', function() {
        it('should can drag and drop with 2 WebElements', function() {
          driver.get(TEST_PAGE_URL);

          var draggable = driver.findElement(By.id('draggable'));
          var droppable = driver.findElement(By.id('droppable'));

          driver.executeScript(dragAndDrop.code, draggable, droppable);

          return driver.findElement(By.id('result'))
            .getText()
            .then(function(text) {
              assert.strictEqual(text, 'OK');
            });
        });
      });

      describe('.codeForSelectors with 2 CSS Selectors', function() {
        it('should can drag and drop', function() {
          driver.get(TEST_PAGE_URL);

          driver.executeScript(dragAndDrop.codeForSelectors,
                               '#draggable', '#droppable');

          return driver.findElement(By.id('result'))
            .getText()
            .then(function(text) {
              assert.strictEqual(text, 'OK');
            });
        });
      });

      after(function() {
        return driver.quit();
      });
    });
  });
});
