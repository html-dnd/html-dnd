var dragAndDrop = require('../../../../lib/index').codeForXPaths;

module.exports = {
  'Drag and Drop with Nightwatch using XPath': function(browser) {
    browser
      .url('https://kuniwak.github.io/html-dnd/test.html')
      .assert.containsText('#result', 'NG')
      .execute(dragAndDrop, ['//*[@id="draggable"]', '//*[@id="droppable"]'])
      .assert.containsText('#result', 'OK')
      .end();
  }
};
