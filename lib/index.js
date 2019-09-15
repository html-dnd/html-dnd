'use strict';

const util = require('util');
const fs = require('fs');
const multiline = require('multiline');
const Path = require('path');

const BASE_DIR = __dirname;
const CODE_FILE = Path.join(BASE_DIR, '..', 'dist', 'html_dnd.js');
const coreCode = fs.readFileSync(CODE_FILE);

exports.code = util.format(multiline(function() {/*
  (function(draggable, droppable) {
    %s;
    dnd.simulate(draggable, droppable);
  })(arguments[0], arguments[1]);
*/}), coreCode);

exports.codeForSelectors = util.format(multiline(function() {/*
  (function(selectorDraggable, selectorDroppable) {
    %s;
    
    var draggable = document.querySelector(selectorDraggable);
    var droppable = document.querySelector(selectorDroppable);

    dnd.simulate(draggable, droppable);
  })(arguments[0], arguments[1]);
*/}), coreCode);

exports.codeForXPaths = util.format(multiline(function() {/*
  (function(selectorDraggable, selectorDroppable) {
    %s;
    
    var draggable = document.evaluate(selectorDraggable, document, null,
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    var droppable = document.evaluate(selectorDroppable, document, null,
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();

    dnd.simulate(draggable, droppable);
  })(arguments[0], arguments[1]);
*/}), coreCode);