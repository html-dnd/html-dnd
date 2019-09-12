var util = require('util');
var fs = require('fs');
var multiline = require('multiline');
var Path = require('path');

var BASE_DIR = __dirname;
var CODE_FILE = Path.join(BASE_DIR, '..', 'dist', 'html_dnd.js');
var coreCode = fs.readFileSync(CODE_FILE, {encoding: 'utf8'});

exports.code = util.format(multiline(function() {/*
  (function(draggable, droppable, dragConfig) {
    %s;
    dnd.simulate(draggable, droppable, dragConfig);
  })(arguments[0], arguments[1], arguments[2]);
*/}), coreCode);

exports.codeForSelectors = util.format(multiline(function() {/*
  (function(selectorDraggable, selectorDroppable, dragConfig) {
    %s;
    
    var draggable = document.querySelector(selectorDraggable);
    var droppable = document.querySelector(selectorDroppable);

    dnd.simulate(draggable, droppable, dragConfig);
  })(arguments[0], arguments[1], arguments[2]);
*/}), coreCode);

exports.codeForXPaths = util.format(multiline(function() {/*
  (function(selectorDraggable, selectorDroppable, dragConfig) {
    %s;
    
    var draggable = document.evaluate(selectorDraggable, document, null,
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    var droppable = document.evaluate(selectorDroppable, document, null,
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();

    dnd.simulate(draggable, droppable, dragConfig);
  })(arguments[0], arguments[1], arguments[2]);
*/}), coreCode);