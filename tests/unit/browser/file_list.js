var assert = chai.assert;

describe('dnd.FileList', function() {
  describe('#item', function() {
    it('should always return null', function() {
      var fileList = new dnd.FileList();
      assert.strictEqual(fileList.item(0), null);
    });
  });

  describe('#length', function() {
    it('should always be 0', function() {
      var fileList = new dnd.FileList();
      assert.lengthOf(fileList, 0);
    });
  });
});
