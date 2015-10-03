var dragAndDrop = require('../../lib/index.js');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;

var TEST_PAGE_URL = 'https://kuniwak.github.io/html-dnd/test.html';

var assert = require('chai').assert;
var testing = require('selenium-webdriver/testing');
var describe = testing.describe;
var before = testing.before;
var after = testing.after;
var it = testing.it;

describe('html-dnd', function() {
  var driver;

  before(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  });

  describe('.code', function() {
    it('should can drag and drop', function() {
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

  describe('.codeForSelectors', function() {
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
