'use strict';
const dragAndDrop = require('../../../lib/index.js');
const {By, Builder} = require('selenium-webdriver');

const TEST_PAGE_URL = 'https://kuniwak.github.io/html-dnd/test.html';

const util = require('util');
const lodash = require('lodash');
const assert = require('assert');

const Fs = require('fs');
const Path = require('path');

function useXPathPolyfill(driver) {
  const WGXPATH_INSTALLER_PATH = Path.resolve(__dirname, '../assets/wgxpath.install.1.3.0.js');
  driver.executeScript(Fs.readFileSync(WGXPATH_INSTALLER_PATH, 'utf8'));
  driver.executeScript('wgxpath.install();');
}

require('dotenv').config({silent: true});

const BASE_CAPABILITY = {
  'sauce:options': {
    name: 'html-dnd E2E Tests',
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
  },
};

const Capabilities = [
  {
    platformName: 'Linux',
    browserName: 'chrome',
    browserVersion: '48.0',
    'goog:chromeOptions': { w3c: true },
  },
  {
    platformName: 'Linux',
    browserName: 'firefox',
    browserVersion: '45.0',
  },
  {
    platformName: 'macOS 10.14',
    browserName: 'safari',
    browserVersion: 'latest',
  },
  {
    platformName: 'Windows 10',
    browserName: 'MicrosoftEdge',
    browserVersion: 'latest',
  },
  {
    platformName: 'Windows 10',
    browserName: 'internet explorer',
    browserVersion: 'latest',
  },
].map((capability) => {
  return lodash.extend({}, BASE_CAPABILITY, capability);
});

describe('html-dnd', () => {
  Capabilities.forEach((capability) => {
    const testCaseName = util.format(
        'on %s %s (%s)',
        capability.browserName,
        capability.browserVersion,
        capability.platformName
    );

    describe(testCaseName, () => {
      let driver;

      before(() => {
        return new Builder()
            .withCapabilities(capability)
            .usingServer('https://ondemand.saucelabs.com/wd/hub')
            .build()
            .then((newDriver) => driver = newDriver);
      });

      describe('.code', () => {
        it('should can drag and drop with 2 WebElements', () => {
          driver.get(TEST_PAGE_URL);

          const draggable = driver.findElement(By.id('draggable'));
          const droppable = driver.findElement(By.id('droppable'));

          return webdriver.promise
              .all([
                driver.executeScript(dragAndDrop.code, draggable, droppable),
                driver.findElement(By.id('result')).getText()
              ])
              .then((tuple) => {
                const result = tuple[0];
                assert.isNull(result);

                const text = tuple[1];
                assert.strictEqual(text, 'OK');
              });
        });
      });

      describe('.codeForSelectors with 2 CSS Selectors', () => {
        it('should can drag and drop', () => {
          driver.get(TEST_PAGE_URL);

          return Promise
              .all([
                driver.executeScript(
                    dragAndDrop.codeForSelectors, '#draggable', '#droppable'),
                driver.findElement(By.id('result')).getText()
              ])
              .then(function(tuple) {
                const result = tuple[0];
                assert.isNull(result);

                const text = tuple[1];
                assert.strictEqual(text, 'OK');
              });
        });
      });

      describe('.codeForSelectors with 2 XPath Selectors', () => {
        it('should can drag and drop', () => {
          driver.get(TEST_PAGE_URL);

          useXPathPolyfill(driver);

          return Promise
              .all([
                driver.executeScript(
                    dragAndDrop.codeForXPaths, '//*[@id="draggable"]', '//*[@id="droppable"]'),
                driver.findElement(By.id('result')).getText()
              ])
              .then((tuple) => {
                const result = tuple[0];
                assert.isNull(result);

                const text = tuple[1];
                assert.strictEqual(text, 'OK');
              });
        });
      });

      after(() => {
        return driver.quit();
      });
    });
  });
});
