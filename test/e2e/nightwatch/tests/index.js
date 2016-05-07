var dragAndDrop = require('../../../../lib/index');

module.exports = {
  'Drag and Drop with Nightwatch using CSS selectors': function(browser) {
    browser
      .url('https://kuniwak.github.io/html-dnd/test.html')
      .assert.containsText('#result', 'NG')
      .execute(dragAndDrop.codeForSelectors, ['#draggable', '#droppable'])
      .assert.containsText('#result', 'OK')
      .end();
  },
  'Drag and Drop with Nightwatch using XPath': function(browser) {
    browser
      .url('https://kuniwak.github.io/html-dnd/test.html')
      .assert.containsText('#result', 'NG')
      .execute(dragAndDrop.codeForXPaths, ['//*[@id="draggable"]', '//*[@id="droppable"]'])
      .assert.containsText('#result', 'OK')
      .end();
  }
};
