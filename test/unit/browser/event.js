var assert = chai.assert;

describe('dnd.createEventWithDataTransfer', function() {
  var Events = Object.keys(dnd.EventType)
    .map(function(event) { return dnd.EventType[event]; });

  Events.forEach(function(event) {
    it('should return an event with #dataTransfer ' +
       'by specified ' + event, function() {
      var event = dnd.createEventWithDataTransfer(event);
      assert.instanceOf(event, Event);
      assert.property(event, 'dataTransfer');
    });
  });
});

describe('dnd.getDataTransferModeByEventType', function() {
  it('should return a read-write mode for dragstart events', function() {
    var eventType = dnd.EventType.DRAG_START;
    var mode = dnd.getDataTransferModeByEventType(eventType);
    assert.strictEqual(mode, dnd.DataTransferMode.READ_WRITE);
  });

  it('should return a read-write mode for drop events', function() {
    var eventType = dnd.EventType.DROP;
    var mode = dnd.getDataTransferModeByEventType(eventType);
    assert.strictEqual(mode, dnd.DataTransferMode.READ_ONLY);
  });

  it('should return a read-write mode for other events', function() {
    var eventType = dnd.EventType.DRAG_END;
    var mode = dnd.getDataTransferModeByEventType(eventType);
    assert.strictEqual(mode, dnd.DataTransferMode.PROTECTED);
  });
});
