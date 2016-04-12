var assert = require('chai').assert;

describe('require("html-dnd")', function() {
  it('should export a property "code" as string', function() {
    var dndSimulator = require('../../../lib/index.js');

    assert.property(dndSimulator, 'code');
    assert.typeOf(dndSimulator.code, 'string');
  });

  it('should export a property "codeForSelectors" as string', function() {
    var dndSimulator = require('../../../lib/index.js');

    assert.property(dndSimulator, 'codeForSelectors');
    assert.typeOf(dndSimulator.codeForSelectors, 'string');
  });
});
