var assert = chai.assert;



describe('dnd.DataTransferItemList', function() {
  describe('#length', function() {
    it('should be 0 after initialization', function() {
      var items = new dnd.DataTransferItemList();
      assert.lengthOf(items, 0);
    });
  });



  describe('#add', function() {
    context('when the associated drag data store is read/write mode', function() {
      var dragDataStoreStub = {mode: 'readwrite'};


      context('when given 2 arguments)', function() {
        context('when #length is 0', function() {
          it('should increment #length', function() {
            var items = new dnd.DataTransferItemList(dragDataStoreStub);

            items.add('text/x-plain-1', 'TEXT_1');

            assert.lengthOf(items, 1);
          });
        });


        context('when #length is 1', function() {
          it('should increment #length', function() {
            var items = new dnd.DataTransferItemList(dragDataStoreStub);
            items.add('text/x-plain-1', 'TEXT_1');

            items.add('text/x-plain-2', 'TEXT_2');

            assert.lengthOf(items, 2);
          });
        });


        context('when #length is 2', function() {
          it('should increment #length', function() {
            var items = new dnd.DataTransferItemList(dragDataStoreStub);
            items.add('text/x-plain-1', 'TEXT_1');
            items.add('text/x-plain-2', 'TEXT_2');

            items.add('text/x-plain-3', 'TEXT_3');

            assert.lengthOf(items, 3);
          });
        });
      });
    });
  });



  describe('#remove', function() {
    context('when the associated drag data store is read/write mode', function() {
      var dragDataStoreStub = {mode: 'readwrite'};


      context('when the given type is not included', function() {
        it('should not change #length', function() {
          var items = new dnd.DataTransferItemList(dragDataStoreStub);

          items.add('text/x-plain-1', 'TEXT_1');
          items.remove(999);

          assert.lengthOf(items, 1);
        });
      });


      context('when the given type is included', function() {
        it('should decrease #length', function() {
          var items = new dnd.DataTransferItemList(dragDataStoreStub);

          items.add('text/x-plain-1', 'TEXT_1');
          items.remove(0);

          assert.lengthOf(items, 0);
        });
      });
    });
  });



  describe('#clear', function() {
    context('when the associated drag data store is read/write mode', function() {
      var dragDataStoreStub = {mode: 'readwrite'};


      context('when the list is empty', function() {
        it('should not change #length', function() {
          var items = new dnd.DataTransferItemList(dragDataStoreStub);

          items.clear();

          assert.lengthOf(items, 0);
        });
      });


      context('when the given type is included', function() {
        it('should decrease #length', function() {
          var items = new dnd.DataTransferItemList(dragDataStoreStub);
          items.add('text/x-plain-1', 'TEXT_1');
          items.add('text/x-plain-2', 'TEXT_2');

          items.clear();

          assert.lengthOf(items, 0);
        });
      });
    });
  });
});
