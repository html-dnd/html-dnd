var global = this;
var dnd = {};

/**
 * Event type for Drag and Drop.
 * @enum {string}
 * @see https://html.spec.whatwg.org/multipage/interaction.html#dndevents
 */
dnd.EventType = {
  DRAG_START: 'dragstart',
  DRAG: 'drag',
  DRAG_ENTER: 'dragenter',
  DRAG_EXIT: 'dragexit',
  DRAG_LEAVE: 'dragleave',
  DRAG_OVER: 'dragover',
  DROP: 'drop',
  DRAG_END: 'dragend'
};

/**
 * Simulates Drag and Drop by HTML Drag and Drop.
 * @param {Element} draggable Element to drag.
 * @param {Element} draggable Element to drop.
 * @see https://html.spec.whatwg.org/multipage/interaction.html#dnd
 */
dnd.simulate = function(draggable, droppable) {
  var dragstartEvent = dnd.createEventWithDataTransfer(
    dnd.EventType.DRAG_START);
  dispatchEvent(draggable, dragstartEvent);

  var dropEvent = dnd.createEventWithDataTransfer(dnd.EventType.DROP);
  dispatchEvent(droppable, dropEvent);

  var dragendEvent = dnd.createEventWithDataTransfer(dnd.EventType.DRAG_END);
  dispatchEvent(draggable, dragendEvent);
};

/**
 * Dispatch the specified event on the element.
 * @param {Element} element Element where the event is fired on.
 * @param {Event} event Event to be fire.
 * @private
 */
var _dispatchEventImpl = global.fireEvent ?
  function(element, event) { element.fireEvent('on' + event.type); } :
  function(element, event) { element.dispatchEvent(event); };

/**
 * Dispatch the specified event on the element.
 * @param {Element} element Element where the event is fired on.
 * @param {Event} event Event to be fire.
 */
function dispatchEvent(element, event) {
  _dispatchEventImpl(element, event);
}

/**
 * Creates an event instance with a DataTransfer.
 * @param {string} type Event type to create.
 * @return {Event} Event with a DataTransfer instance.
 */
dnd.createEventWithDataTransfer = function(type) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(type, true, true, null);

  var mode = dnd.getDataTransferModeByEventType(type);
  event.dataTransfer = new dnd.DataTransfer(mode);
  return event;
};

/**
 * Returns a DataTransfer mode of the specified event.
 * @param {dnd.EventType} type Event type.
 * @return {dnd.DataTransferMode} DataTransfer mode.
 */
dnd.getDataTransferModeByEventType = function(type) {
  switch (type) {
    case dnd.EventType.DRAG_START:
      return dnd.DataTransferMode.READ_WRITE;
    case dnd.EventType.DROP:
      return dnd.DataTransferMode.READ_ONLY;
    default:
      return dnd.DataTransferMode.PROTECTED;
  }
};

/**
 * This interface is a list of File objects.
 *
 * NOTE: This implementation can represent only empty FileList.
 * @constructor
 * @see http://www.w3.org/TR/FileAPI/#dfn-filelist
 */
dnd.FileList = function() {
  /**
   * length must return the number of files in the FileList object. If there
   * are no files, this attribute must return 0.
   * @type {number}
   */
  this.length = 0;
};

/**
 * item must return the indexth File object in the FileList. If there is no
 * indexth File object in the FileList, then this method must return null.
 * @param {number} index must be treated by user agents as value for the
 *     position of a File object in the FileList, with 0 representing the
 *     first file. Supported property indices [WebIDL] are the numbers in the
 *     range zero to one less than the number of File objects represented by
 *     the FileList object. If there are no such File objects, then there are
 *     no supported property indices [WebIDL].
 * @return {File?}
 */
dnd.FileList.prototype.item = function(index) {
  return null;
};

/**
 * DataTransfer objects are used to expose the drag data store that underlies
 * a drag-and-drop operation.
 * @constructor
 * @see http://www.w3.org/TR/2011/WD-html5-20110525/dnd.html#the-datatransfer-interface
 * @param {dnd.DataTransferMode} mode
 */
dnd.DataTransfer = function(mode) {
  /**
   * The actual data.
   * @type {Object<string, string>}
   * @private
   */
  this._data = {};

  /**
   * A drag data store mode.
   * @type {dnd.DataTransferMode}
   * @private
   */
  this._mode = mode;

  /**
   * @type {Array<string>}
   */
  this.types = [];

  /**
   * Returns a FileList of the files being dragged, if any.
   * @type {FileList|dnd.FileList}
   */
  this.files = new dnd.FileList();
};

/**
 * A drag data store mode.
 * @enum {string}
 */
dnd.DataTransferMode = {
  /**
   * For the dragstart event. New data can be added to the drag data store.
   */
  READ_WRITE: 'READ_WRITE',
  /**
   * For the drop event. The list of items representing dragged data can be
   * read, including the data. No new data can be added.
   */
  READ_ONLY: 'READ_ONLY',
  /**
   * For all other events. The formats and kinds in the drag data store list
   * of items representing dragged data can be enumerated, but the data itself
   * is unavailable and no new data can be added.
   */
  PROTECTED: 'PROTECTED'
};

/**
 * Returns the specified data. If there is no such data, returns the empty
 * string.
 * @param {string} format
 * @return {string}
 */
dnd.DataTransfer.prototype.getData = function(format) {
  // If the DataTransfer object is no longer associated with a drag data
  // store, return the empty string and abort these steps.

  // If the drag data store's mode is in the protected mode, return the empty
  // string and abort these steps.
  if (this._mode === dnd.DataTransferMode.PROTECTED) {
    return '';
  }

  // Let format be the first argument, converted to ASCII lowercase.
  format = format.toLowerCase();

  // Let convert-to-URL be false.
  var convertToUrl = false;

  // Let format be the first argument, converted to ASCII lowercase.
  format = format.toLowerCase();

  // If format equals "text", change it to "text/plain".
  // If format equals "url", change it to "text/uri-list" and set
  // convert-to-URL to true.
  if (format === 'text') {
    format = 'text/plain';
  } else if (format === 'url') {
    format = 'text/uri-list';
    convertToUrl = true;
  }

  // If there is no item in the drag data store item list whose kind is Plain
  // Unicode string and whose type string is equal to format, return the empty
  // string and abort these steps.
  if (!(format in this._data)) {
    return '';
  }

  // Let result be the data of the item in the drag data store item list whose
  // kind is Plain Unicode string and whose type string is equal to format.
  var result = this._data[format];

  // If convert-to-URL is true, then parse result as appropriate for
  // text/uri-list data, and then set result to the first URL from the list,
  // if any, or the empty string otherwise. [RFC2483]
  if (convertToUrl) {
    result = dnd.parseTextUriList(result)[0] || '';
  }

  // Return result.
  return result;
};

/**
 * Adds the specified data.
 * @param {string} format
 * @param {string} data
 */
dnd.DataTransfer.prototype.setData = function(format, data) {
  // If the DataTransfer object is no longer associated with a drag data
  // store, abort these steps. Nothing happens.

  // If the drag data store's mode is not the read/write mode, abort these
  // steps. Nothing happens.
  if (this._mode !== dnd.DataTransferMode.READ_WRITE) {
    return;
  }

  // Let format be the first argument, converted to ASCII lowercase.
  format = format.toLowerCase();

  // If format equals "text", change it to "text/plain".
  // If format equals "url", change it to "text/uri-list".
  if (format === 'text') {
    format = 'text/plain';
  } else if (format === 'url') {
    format = 'text/uri-list';
  }

  // Remove the item in the drag data store item list whose kind is Plain
  // Unicode string and whose type string is equal to format, if there is one.
  // Add an item to the drag data store item list whose kind is Plain Unicode
  // string, whose type string is equal to format, and whose data is the
  // string given by the method's second argument.
  this._data[format] = data;
  this.types = Object.keys(this._data);
};

/**
 * Removes the data of the specified formats. Removes all data if the argument
 * is omitted.
 * @param {string=} opt_format
 */
dnd.DataTransfer.prototype.clearData = function(opt_format) {
  // If the DataTransfer object is no longer associated with a drag data
  // store, abort these steps. Nothing happens.

  // If the drag data store's mode is not the read/write mode, abort these
  // steps. Nothing happens.
  if (this._mode !== dnd.DataTransferMode.READ_WRITE) {
    return;
  }

  // If the method was called with no arguments, remove each item in the drag
  // data store item list whose kind is Plain Unicode string, and abort these
  // steps.
  if (opt_format === undefined) {
    // Note: The clearData() method does not affect whether any files were
    // included in the drag, so the types attribute's list might still not be
    // empty after calling clearData() (it would still contain the "Files"
    // string if any files were included in the drag).
    var typesWillBeRemoved = this.types.filter(function(type) {
      return !type.match('Files');
    });
    typesWillBeRemoved.forEach(this.clearData.bind(this));
    return;
  }

  // Let format be the first argument, converted to ASCII lowercase.
  var format = opt_format.toLowerCase();

  // If format equals "text", change it to "text/plain".
  // If format equals "url", change it to "text/uri-list".
  if (format === 'text') {
    format = 'text/plain';
  } else if (format === 'url') {
    format = 'text/uri-list';
  }

  // Remove the item in the drag data store item list whose kind is Plain
  // Unicode string and whose type string is equal to format, if there is one.
  delete this._data[format];
  this.types = Object.keys(this._data);
};

/**
 * Return an array of URL strings.
 * @param {string} textUriList Parse to string.
 * @return {Array<string>} An array of URL strings.
 * @see http://tools.ietf.org/html/rfc2483
 */
dnd.parseTextUriList = function(textUriList) {
  // As for all text/(*) formats, lines are terminated with a CRLF pair.
  textUriList = textUriList.replace(/\r\n$/, '');

  if (textUriList === '') {
    return [];
  }

  return textUriList.split(/\r\n/).filter(function(line) {
    // Any lines beginning with the '#' character are comment lines
    // and are ignored during processing.
    // The remaining non-comment lines shall be URIs (URNs or URLs),
    // encoded according to the URL or URN specifications (RFC2141,
    // RFC1738 and RFC2396). Each URI shall appear on one and only one
    // line. Very long URIs are not broken in the text/uri-list format.
    // Content-transfer-encodings may be used to enforce line length
    // limitations.
    return line[0] !== '#';
  });
};
