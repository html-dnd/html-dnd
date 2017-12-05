var util = require('util');
var fs = require('fs');
var Path = require('path');

var BASE_DIR = __dirname;
var CODE_FILE = Path.join(BASE_DIR, '..', 'dist', 'html_dnd.js');
var coreCode = fs.readFileSync(CODE_FILE);

exports.code = util.format(`(function(draggable, droppable, dndSimulateConfig) {
    %s;
    dnd.simulate(draggable, droppable, dndSimulateConfig);
  })(arguments[0],arguments[1],arguments[2]);`, coreCode);

exports.codeForSelectors = util.format(`(function(selectorDraggable, selectorDroppable, dndSimulateConfig) {
    %s;
    
    var draggable = document.querySelector(selectorDraggable);
    var droppable = document.querySelector(selectorDroppable);

    dnd.simulate(draggable, droppable, dndSimulateConfig);
  })(arguments[0], arguments[1], arguments[2]);`, coreCode);

exports.codeForXPaths = util.format(`(function(selectorDraggable, selectorDroppable, dndSimulateConfig) {
    %s;
    
    var draggable = document.evaluate(selectorDraggable, document, null,
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    var droppable = document.evaluate(selectorDroppable, document, null,
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();

    dnd.simulate(draggable, droppable, dndSimulateConfig);
  })(arguments[0], arguments[1], arguments[2]);`, coreCode);