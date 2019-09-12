namespace dnd {
  "use strict";

  interface IDragConfig {
    onlyHover: boolean;
    hoverTime: number;
  }

  export function simulate(draggable: Element, droppable: Element, config: IDragConfig = { onlyHover: false, hoverTime: 0 }): void {
    if (!config.onlyHover) {
      simulateDragAndDrop(draggable, droppable);
    } else {
      simulateDragOver(draggable, droppable, config.hoverTime);
    }
  }

  export function simulateDragAndDrop(draggable: Element, droppable: Element): void {
    const store = new DragDataStore();
    // For the dragstart event. New data can be added to the drag data store.
    store.mode = "readwrite";

    const dataTransfer = new DataTransfer(store);

    dragStart(draggable, dataTransfer);

    dragOver(store, droppable, dataTransfer);

    drop(droppable, dataTransfer);

    endDrag(store, draggable, dataTransfer);
  }

  export function simulateDragOver(draggable: Element, droppable: Element, hoverTime: number = 0): void {
    const store = new DragDataStore();
    // For the dragstart event. New data can be added to the drag data store.
    store.mode = "readwrite";

    const dataTransfer = new DataTransfer(store);

    dragStart(draggable, dataTransfer);

    dragOver(store, droppable, dataTransfer);

    setTimeout(() => {

      dragLeave(droppable, dataTransfer);

      endDrag(store, draggable, dataTransfer);

    }, hoverTime);
  }

  function dragStart(draggable: Element, dataTransfer: DataTransfer): void {
    const dragstartEvent = createEventWithDataTransfer("dragstart", dataTransfer);
    draggable.dispatchEvent(dragstartEvent);
  }

  function dragOver(store: DragDataStore, droppable: Element, dataTransfer: DataTransfer): void {
    // For the drop event. The list of items representing dragged data can be
    // read, including the data. No new data can be added.
    store.mode = "readonly";
    const dragEnterEvent = createEventWithDataTransfer("dragenter", dataTransfer);
    droppable.dispatchEvent(dragEnterEvent);

    const dragOverEvent = createEventWithDataTransfer("dragover", dataTransfer);
    droppable.dispatchEvent(dragOverEvent);
  }

  function drop(droppable: Element, dataTransfer: DataTransfer): void {
    const dropEvent = createEventWithDataTransfer("drop", dataTransfer);
    droppable.dispatchEvent(dropEvent);
  }

  function dragLeave(droppable: Element, dataTransfer: DataTransfer): void {
    const dragExitEvent = createEventWithDataTransfer("dragexit", dataTransfer);
    droppable.dispatchEvent(dragExitEvent);
    const dragLeaveEvent = createEventWithDataTransfer("dragleave", dataTransfer);
    droppable.dispatchEvent(dragLeaveEvent);
  }

  function endDrag(store: DragDataStore, draggable: Element, dataTransfer: DataTransfer): void {
    // For all other events. The formats and kinds in the drag data store list
    // of items representing dragged data can be enumerated, but the data itself
    // is unavailable and no new data can be added.
    store.mode = "protected";

    const dragendEvent = createEventWithDataTransfer("dragend", dataTransfer);
    draggable.dispatchEvent(dragendEvent);
  }


  /**
   * Creates an event instance with a DataTransfer.
   */
  function createEventWithDataTransfer(type: EventType, dataTransfer: DataTransfer): DragEvent {
    const event = <any>document.createEvent("CustomEvent");
    event.initCustomEvent(type, true, true, null);
    event.dataTransfer = dataTransfer;
    return event;
  }


  type EventType = 'dragstart'
    | 'drag'
    | 'dragenter'
    | 'dragexit' /*Mozilla only https://en.wikipedia.org/wiki/DOM_events#XUL_events*/
    | 'dragleave'
    | 'dragover'
    | 'drop'
    | 'dragend';

  /**
   * DataTransfer objects are used to expose the drag data store that underlies
   * a drag-and-drop operation.
   *
   * @see https://html.spec.whatwg.org/multipage/interaction.html#datatransferitem
   */
  export class DataTransfer {
    constructor(private store: DragDataStore) { }


    /**
     * @see DataTransfer#setData
     */
    private typeTable: { [type: string]: string } = {};


    /**
     * Returns the kind of operation that is currently selected. If the kind of
     * operation isn't one of those that is allowed by the effectAllowed
     * attribute, then the operation will fail.
     *
     * Can be set, to change the selected operation.
     *
     * The possible values are "none", "copy", "link", and "move".
     */
    dropEffect: DropEffect;


    /**
     * Returns the kinds of operations that are to be allowed.
     *
     * Can be set (during the dragstart event), to change the allowed
     * operations.
     *
     * The possible values are "none", "copy", "copyLink", "copyMove", "link",
     * "linkMove", "move", "all", and "uninitialized",
     */
    effectAllowed: EffectAllowed = "uninitialized";


    /**
     * Returns a DataTransferItemList object, with the drag data.
     */
    items: DataTransferItemList;


    /**
     * Uses the given element to update the drag feedback, replacing any
     * previously specified feedback.
     */
    setDragImage(element: Element, x: number, y: number): void {
      // Do nothing.
    }


    /**
     * Returns an array listing the formats that were set in the dragstart
     * event. In addition, if any files are being dragged, then one of the types
     * will be the string "Files".
     */
    types: string[] = [];


    /**
     * Returns the specified data. If there is no such data, returns the empty
     * string.
     */
    getData(format: string): string {
      // If the DataTransfer object is no longer associated with a drag data
      // store, return the empty string and abort these steps.

      // If the drag data store's mode is in the protected mode, return the empty
      // string and abort these steps.
      if (this.store.mode === "protected") {
        return "";
      }

      // Let format be the first argument, converted to ASCII lowercase.
      format = format.toLowerCase();

      // Let convert-to-URL be false.
      let convertToUrl = false;

      if (format === "text") {
        // If format equals "text", change it to "text/plain".
        format = "text/plain";
      } else if (format === "url") {
        // If format equals "url", change it to "text/uri-list" and set
        // convert-to-URL to true.
        format = "text/uri-list";
        convertToUrl = true;
      }

      // If there is no item in the drag data store item list whose kind is Plain
      // Unicode string and whose type string is equal to format, return the empty
      // string and abort these steps.
      if (!(format in this.typeTable)) {
        return "";
      }

      // Let result be the data of the item in the drag data store item list whose
      // kind is Plain Unicode string and whose type string is equal to format.
      let result = this.typeTable[format];

      // If convert-to-URL is true, then parse result as appropriate for
      // text/uri-list data, and then set result to the first URL from the list,
      // if any, or the empty string otherwise. [RFC2483]
      if (convertToUrl) {
        result = parseTextUriList(result)[0] || "";
      }

      // Return result.
      return result;
    }


    /**
     * Adds the specified data.
     */
    setData(format: string, data: string): void {
      // If the DataTransfer object is no longer associated with a drag data
      // store, abort these steps. Nothing happens.
      if (!this.store) {
        return;
      }

      // If the drag data store's mode is not the read/write mode, abort these
      // steps. Nothing happens.
      if (this.store.mode !== "readwrite") {
        return;
      }

      // Let format be the first argument, converted to ASCII lowercase.
      format = format.toLowerCase();

      // If format equals "text", change it to "text/plain".
      // If format equals "url", change it to "text/uri-list".
      if (format === "text") {
        format = "text/plain";
      } else if (format === "url") {
        format = "text/uri-list";
      }

      // Remove the item in the drag data store item list whose kind is Plain
      // Unicode string and whose type string is equal to format, if there is
      // one. Add an item to the drag data store item list whose kind is Plain
      // Unicode string, whose type string is equal to format, and whose data
      // is the string given by the method's second argument.
      this.typeTable[format] = data;
      this.types = Object.keys(this.typeTable);
    }


    /**
     * Removes the data of the specified formats. Removes all data if the
     * argument is omitted.
     */
    clearData(format?: string): void {
      // If the DataTransfer object is no longer associated with a drag data
      // store, abort these steps. Nothing happens.
      if (!this.store) {
        return;
      }

      // If the drag data store's mode is not the read/write mode, abort these
      // steps. Nothing happens.
      if (this.store.mode !== "readwrite") {
        return;
      }

      // If the method was called with no arguments, remove each item in the
      // drag data store item list whose kind is Plain Unicode string, and abort
      // these steps.
      if (typeof format === "undefined") {
        // Note: The clearData() method does not affect whether any files were
        // included in the drag, so the types attribute's list might still not
        // be empty after calling clearData() (it would still contain the
        // "Files" string if any files were included in the drag).
        this.types.filter((type) => type !== "Files")
          .forEach((type) => this.clearData(type));

        return;
      }

      // Let format be the first argument, converted to ASCII lowercase.
      format = format.toLowerCase();

      // If format equals "text", change it to "text/plain".
      // If format equals "url", change it to "text/uri-list".
      if (format === "text") {
        format = "text/plain";
      } else if (format === "url") {
        format = "text/uri-list";
      }

      // Remove the item in the drag data store item list whose kind is Plain
      // Unicode string and whose type string is equal to format, if there is
      // one.
      delete this.typeTable[format];
      this.types = Object.keys(this.typeTable);
    }


    /**
     * Returns a FileList of the files being dragged, if any.
     */
    files: FileList = new FileList();
  }


  /**
   * @see DataTransfer#dropEffect
   */
  type DropEffect = "none"
    | "copy"
    | "link"
    | "move";


  /**
   * @see DataTransfer#effectAllowed
   */
  type EffectAllowed = "none"
    | "copy"
    | "copyLink"
    | "copyMove"
    | "link"
    | "linkMove"
    | "move"
    | "all"
    | "uninitialized";


  /**
   * @see https://w3c.github.io/FileAPI/#filelist-section
   */
  export class FileList {
    length = 0;


    // NOTE: This implementation can represent only empty FileList.
    item(index: number): File {
      return null;
    }
  }



  /**
   * The data that underlies a drag-and-drop operation, known as the drag data
   * store, consists of the following information:
   *
   */
  class DragDataStore {
    mode: DragDataStoreMode;
  }


  /**
   * @see DragDataStore#mode
   */
  type DragDataStoreMode = "readwrite" | "readonly" | "protected";



  /**
   * Each DataTransfer object is associated with a DataTransferItemList object.
   * @see https://html.spec.whatwg.org/multipage/interaction.html#datatransferitemlist
   */
  export class DataTransferItemList {
    constructor(private store: DragDataStore) { }


    /**
     * Each DataTransfer object is associated with a DataTransferItemList
     * object.
     */
    private items: DataTransferItem[] = [];


    /**
     * @see DataTransferItemList#add
     */
    private typeTable: { [type: string]: boolean } = {};


    /**
     * Returns the number of items in the drag data store.
     */
    length: number = 0;


    /**
     * Returns the DataTransferItem object representing the indexth entry in the
     * drag data store.
     */
    [index: number]: DataTransferItem;


    /**
     * Removes the indexth entry in the drag data store.
     */
    remove(idx: number): void {
      // If the DataTransferItemList object is not in the read/write mode, throw
      // an InvalidStateError exception and abort these steps.
      if (this.store.mode !== "readwrite") {
        throw InvalidStateError.createByDefaultMessage();
      }

      // Remove the ith item from the drag data store.
      const [removed] = this.items.splice(idx, 1);
      this.syncInternal();

      if (removed) {
        delete this.typeTable[removed.type];
      }
    }


    /**
     * Removes all the entries in the drag data store.
     */
    clear(): void {
      // If the DataTransferItemList object is not in the read/write mode, throw
      // an InvalidStateError exception and abort these steps.
      if (this.store.mode !== "readwrite") {
        throw InvalidStateError.createByDefaultMessage();
      }

      // Remove the ith item from the drag data store.
      this.items = [];
      this.syncInternal();
    }


    /**
     * Adds a new entry for the given data to the drag data store. If the data
     * is plain text then a type string has to be provided also.
     */
    add(data: File): void;
    add(data: string, type: string): void;
    add(data: any, type?: any): void {
      // If the DataTransferItemList object is not in the read/write mode,
      // return null and abort these steps.
      if (this.store.mode !== "readwrite") {
        return null;
      }

      // Jump to the appropriate set of steps from the following list:
      //   A: If the first argument to the method is a string
      //   B: If the first argument to the method is a File
      if (typeof data === "string") {
        // If there is already an item in the drag data store item list whose
        // kind is Plain Unicode string and whose type string is equal to the
        // value of the method's second argument, converted to ASCII lowercase,
        // then throw a NotSupportedError exception and abort these steps.
        const typeLowerCase = type.toLowerCase();
        if (this.typeTable[typeLowerCase]) {
          throw NotSupportedError.createByDefaultMessage();
        }

        // Otherwise, add an item to the drag data store item list whose kind is
        // Plain Unicode string, whose type string is equal to the value of the
        // method's second argument, converted to ASCII lowercase, and whose
        // data is the string given by the method's first argument.
        const stringItem = DataTransferItem.createForString(
          data, typeLowerCase, this.store);
        this.items.push(stringItem);
        this.typeTable[typeLowerCase] = true;
      }
      else {
        // Add an item to the drag data store item list whose kind is File,
        // whose type string is the type of the File, converted to ASCII
        // lowercase, and whose data is the same as the File's data.
        const fileItem = DataTransferItem.createForFile(
          data, this.store);
        this.items.push(fileItem);
      }

      this.syncInternal();
    }


    private syncInternal(): void {
      for (let i = 0; i < this.length; i++) {
        delete this[i];
      }

      this.items.forEach((item, j) => {
        this[j] = item;
      });

      this.length = this.items.length;
    }
  }



  /**
   * While the DataTransferItem object's DataTransfer object is associated with
   * a drag data store and that drag data store's drag data store item list
   * still contains the item that the DataTransferItem object represents, the
   * DataTransferItem object's mode is the same as the drag data store mode.
   * When the DataTransferItem object's DataTransfer object is not associated
   * with a drag data store, or if the item that the DataTransferItem object
   * represents has been removed from the relevant drag data store item list,
   * the DataTransferItem object's mode is the disabled mode. The drag data
   * store referenced in this section (which is used only when the
   * DataTransferItem object is not in the disabled mode) is the drag data store
   * with which the DataTransferItem object's DataTransfer object is associated.
   *
   * @see https://html.spec.whatwg.org/multipage/interaction.html#datatransferitem
   */
  class DataTransferItem {
    constructor(private data: File | string, kind: DataTransferItemKind,
      typeLowerCase: string, private store: DragDataStore) {
      this.type = typeLowerCase;
      this.kind = kind;
    }


    /**
     * The type attribute must return the empty string if the DataTransferItem
     * object is in the disabled mode; otherwise it must return the drag data
     * item type string of the item represented by the DataTransferItem object.
     */
    public type: string;


    /**
     * The kind attribute must return the empty string if the DataTransferItem
     * object is in the disabled mode; otherwise it must return the string given
     * in the cell from the second column of the following table from the row
     * whose cell in the first column contains the drag data item kind of the item
     * represented by the DataTransferItem object:
     *
     * | Kind                 | String   |
     * |:---------------------|:---------|
     * | Plain Unicode string | "string" |
     * | File                 | "file"   |
     */
    public kind: DataTransferItemKind;


    getAsString(callback: (data: string) => void): void {
      // If the callback is null, abort these steps.
      if (callback) {
        return;
      }

      // If the DataTransferItem object is not in the read/write mode or the
      // read-only mode, abort these steps. The callback is never invoked.
      if (this.store.mode !== "readwrite") {
        return;
      }

      // If the drag data item kind is not Plain Unicode string, abort these
      // steps. The callback is never invoked.
      if (this.kind !== "string") {
        return;
      }

      // Otherwise, queue a task to invoke callback, passing the actual data of
      // the item represented by the DataTransferItem object as the argument.
      setTimeout(() => {
        callback(<string>this.data);
      }, 0);
    }


    getAsFile(): File {
      // If the DataTransferItem object is not in the read/write mode or the
      // read-only mode, return null and abort these steps.
      if (this.store.mode !== "readwrite") {
        return null;
      }

      // If the drag data item kind is not File, then return null and abort
      // these steps.
      if (this.kind !== "string") {
        return null;
      }

      // Return a new File object representing the actual data of the item
      // represented by the DataTransferItem object.
      return <File>this.data;
    }


    static createForString(data: string, type: string,
      store: DragDataStore): DataTransferItem {
      return new DataTransferItem(data, "string", type, store);
    }


    static createForFile(data: File, store: DragDataStore): DataTransferItem {
      return new DataTransferItem(data, "file", null, store);
    }
  }


  /**
   * @see DataTransferItem#kind
   */
  type DataTransferItemKind = "string" | "file";


  /**
   * @see https://heycam.github.io/webidl/#invalidstateerror
   */
  class InvalidStateError extends Error {
    constructor(message: string) {
      super(message);
      this.message = message;
      this.name = "InvalidStateError";
    }


    static createByDefaultMessage(): InvalidStateError {
      return new InvalidStateError("The object is in an invalid state");
    }
  }


  /**
   * @see https://heycam.github.io/webidl/#notsupportederror
   */
  class NotSupportedError extends Error {
    constructor(message: string) {
      super(message);
      this.message = message;
      this.name = "NotSupportedError";
    }


    static createByDefaultMessage(): NotSupportedError {
      return new InvalidStateError("The operation is not supported");
    }
  }


  /**
   * Return an array of URL strings.
   * @see http://tools.ietf.org/html/rfc2483
   */
  export function parseTextUriList(textUriList: string): string[] {
    // As for all text/(*) formats, lines are terminated with a CRLF pair.
    textUriList = textUriList.replace(/\r\n$/, "");

    if (textUriList === "") {
      return <string[]>[];
    }

    return textUriList.split(/\r\n/).filter((line) => {
      // Any lines beginning with the '#' character are comment lines
      // and are ignored during processing.
      // The remaining non-comment lines shall be URIs (URNs or URLs),
      // encoded according to the URL or URN specifications (RFC2141,
      // RFC1738 and RFC2396). Each URI shall appear on one and only one
      // line. Very long URIs are not broken in the text/uri-list format.
      // Content-transfer-encodings may be used to enforce line length
      // limitations.
      return line[0] !== "#";
    });
  };
}
