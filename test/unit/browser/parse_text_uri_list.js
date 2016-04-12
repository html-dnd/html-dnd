var assert = chai.assert;

describe('dnd.parseTextUriList', function() {
  [
    {
      itShouldReturn: [],
      whenSpecified: linesTerminatedByCrLf([])
    },
    {
      itShouldReturn: [],
      whenSpecified: linesTerminatedByCrLf(['# comment'])
    },
    {
      itShouldReturn: ['http://example.com'],
      whenSpecified: linesTerminatedByCrLf([
        '# comment',
        'http://example.com'
      ])
    },
    {
      itShouldReturn: ['http://example.com'],
      whenSpecified: linesTerminatedByCrLf(['http://example.com'])
    },
    {
      itShouldReturn: [
        'http://example.com/1',
        'http://example.com/2'
      ],
      whenSpecified: linesTerminatedByCrLf([
        'http://example.com/1',
        'http://example.com/2'
      ])
    }
  ].forEach(function(testCase) {
    it('should return ' + JSON.stringify(testCase.itShouldReturn) +
       ' when specified ' + JSON.stringify(testCase.whenSpecified), function() {
      assert.deepEqual(
        dnd.parseTextUriList(testCase.whenSpecified),
        testCase.itShouldReturn
      );
    });
  });

  function linesTerminatedByCrLf(lines) {
    return lines.join('\r\n') + '\r\n';
  }
});
