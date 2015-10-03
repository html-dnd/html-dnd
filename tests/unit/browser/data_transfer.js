var assert = chai.assert;

describe('dnd.DataTransfer', function() {
  var DataTransfer = dnd.DataTransfer;
  var DataTransferMode = dnd.DataTransferMode;

  var ReadableModes = [
    DataTransferMode.READ_WRITE,
    DataTransferMode.READ_ONLY
  ];
  var NotReadableModes = [DataTransferMode.PROTECTED];

  var WritableModes = [DataTransferMode.READ_WRITE];
  var NotWritableModes = [
    DataTransferMode.READ_ONLY,
    DataTransferMode.PROTECTED
  ];

  describe('#types', function() {
    WritableModes.forEach(function(writableMode) {
      describe('on ' + writableMode, function() {
        it('should have an empty types on ', function() {
          var dataTransfer = new DataTransfer(writableMode);

          assert.deepEqual([], dataTransfer.types);
        });

        it('should have a type set by setData', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('text/plain', 'DATA');

          assert.deepEqual(['text/plain'], dataTransfer.types);
        });

        it('should have the type "text/plain" that set by ' +
           'setData with the format "text"', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('text', 'DATA');

          assert.deepEqual(['text/plain'], dataTransfer.types);
        });

        it('should have the type "text/uri-list" that set by ' +
           'setData with the format "url"', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('url', 'http://example.com');

          assert.deepEqual(['text/uri-list'], dataTransfer.types);
        });

        it('should have several types set by setData', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('format1', 'DATA');
          dataTransfer.setData('format2', 'DATA');

          assert.deepEqual(['format1', 'format2'], dataTransfer.types);
        });

        it('should have the only type that not be ' +
           'removed by clearData', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('format1', 'DATA');
          dataTransfer.setData('format2', 'DATA');

          dataTransfer.clearData('format1');

          assert.deepEqual(['format2'], dataTransfer.types);
        });

        it('should have the only type that not remove by ' +
           'clearData with the format "text"', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('text', 'DATA');
          dataTransfer.setData('format', 'DATA');

          dataTransfer.clearData('text');

          assert.deepEqual(['format'], dataTransfer.types);
        });

        it('should have the only type that not remove by ' +
           'clearData with the format "url"', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('url', 'DATA');
          dataTransfer.setData('format', 'DATA');

          dataTransfer.clearData('url');

          assert.deepEqual(['format'], dataTransfer.types);
        });

        it('should have no types that removed all by clearData', function() {
          var dataTransfer = new DataTransfer(writableMode);
          dataTransfer.setData('format1', 'DATA');
          dataTransfer.setData('format2', 'DATA');

          dataTransfer.clearData();

          assert.deepEqual([], dataTransfer.types);
        });
      });
    });

    NotWritableModes.forEach(function(notWritableMode) {
      describe('on ' + notWritableMode, function() {
        it('should have an empty types', function() {
          var dataTransfer = new DataTransfer(notWritableMode);

          assert.deepEqual([], dataTransfer.types);
        });

        it('should not be affected by setData', function() {
          var dataTransfer = new DataTransfer(notWritableMode);
          dataTransfer.setData('text/plain', 'DATA');

          assert.deepEqual([], dataTransfer.types);
        });

        it('should not be affected by clearData', function() {
          var dataTransfer = new DataTransfer(DataTransferMode.READ_WRITE);
          dataTransfer.setData('text/plain', 'DATA');
          // HACK: change mode to test
          dataTransfer._mode = notWritableMode;

          dataTransfer.clearData();

          assert.deepEqual(['text/plain'], dataTransfer.types);
        });
      });
    });
  });

  describe('#getData', function() {
    ReadableModes.forEach(function(readableMode) {
      describe('on ' + readableMode, function() {
        it('should return an empty string when there are no data', function() {
          var dataTransfer = new DataTransfer(readableMode);

          assert.strictEqual('', dataTransfer.getData('undefined'));
        });

        it('should return the stored string set by setData', function() {
          var dataTransfer = new DataTransfer(DataTransferMode.READ_WRITE);
          dataTransfer.setData('text/plain', 'DATA');
          dataTransfer._mode = readableMode;

          assert.deepEqual('DATA', dataTransfer.getData('text/plain'));
        });

        it('should return the stored string set by setData ' +
           'with the format "text"', function() {
          var dataTransfer = new DataTransfer(DataTransferMode.READ_WRITE);
          dataTransfer.setData('text', 'DATA');
          dataTransfer._mode = readableMode;

          assert.deepEqual('DATA', dataTransfer.getData('text'));
        });

        it('should return the stored URL set by setData ' +
           'with the format "url"', function() {
          var dataTransfer = new DataTransfer(DataTransferMode.READ_WRITE);
          dataTransfer.setData('url', 'http://example.com');
          dataTransfer._mode = readableMode;

          assert.deepEqual('http://example.com', dataTransfer.getData('url'));
        });

        it('should return an empty string set by setData ' +
           'with the format "url"', function() {
          var dataTransfer = new DataTransfer(DataTransferMode.READ_WRITE);
          dataTransfer.setData('url', '# comment');
          dataTransfer._mode = readableMode;

          assert.deepEqual('', dataTransfer.getData('url'));
        });
      });
    });

    NotReadableModes.forEach(function(notReadableMode) {
      describe('on ' + notReadableMode, function() {
        it('should return an empty string when there are no data', function() {
          var dataTransfer = new DataTransfer(notReadableMode);

          assert.strictEqual('', dataTransfer.getData('undefined'));
        });

        it('should return always an empty string', function() {
          var dataTransfer = new DataTransfer(DataTransferMode.READ_WRITE);
          dataTransfer.setData('text/plain', 'DATA');
          dataTransfer._mode = notReadableMode;

          assert.deepEqual('', dataTransfer.getData('text/plain'));
        });
      });
    });
  });
});
