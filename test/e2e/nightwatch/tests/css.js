var dragAndDrop = require('../../../../lib/index').codeForSelectors;

module.exports = {
  'Drag and Drop with Nightwatch using CSS selectors': function(browser) {
    browser
      .url('https://kuniwak.github.io/html-dnd/test.html')
      .assert.containsText('#result', 'NG')
      .execute(dragAndDrop, ['#draggable', '#droppable'])
      .assert.containsText('#result', 'OK')
      .end();
  }
};
