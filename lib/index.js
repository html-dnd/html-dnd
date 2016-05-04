var util = require('util');
var fs = require('fs');
var multiline = require('multiline');
var Path = require('path');

var BASE_DIR = __dirname;
var CODE_FILE = Path.join(BASE_DIR, '..', 'dist', 'html_dnd.js');
var coreCode = fs.readFileSync(CODE_FILE);

exports.code = util.format(multiline(function() {/*
  (function(draggable, droppable) {
    %s;
    dnd.simulate(draggable, droppable);
  })(arguments[0], arguments[1]);
*/}), coreCode);

exports.codeForSelectors = util.format(multiline(function() {/*
  (function(selectorDraggable, selectorDroppable, useXPath) {
    var draggable;
    var droppable;
    %s;
    
    if(!useXPath){
      draggable = document.querySelector(selectorDraggable);
      droppable = document.querySelector(selectorDroppable);
    }
    else {
      draggable = document.evaluate(selectorDraggable, document, null,
                  XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      droppable = document.evaluate(selectorDroppable, document, null,
                  XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    }
    dnd.simulate(draggable, droppable);
  })(arguments[0], arguments[1], arguments[2]);
*/}), coreCode);
