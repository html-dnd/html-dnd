HTML Drag and Drop Simulator
============================
[![Circle CI](https://circleci.com/gh/Kuniwak/html-dnd.svg?style=shield)](https://circleci.com/gh/Kuniwak/html-dnd)
[![npm version](https://badge.fury.io/js/html-dnd.svg)](http://badge.fury.io/js/html-dnd)

[HTML Drag and Drop](https://html.spec.whatwg.org/multipage/interaction.html#dnd) Simulator for E2E testing.

Now, [WebDriver](http://www.w3.org/TR/webdriver/) cannot handle HTML Drag and Drop.
This module can simulate the HTML Drag and Drop by using the [Execute Script command](http://www.w3.org/TR/webdriver/#execute-script).

This module is like [rcorreia/drag_and_drop_helper.js](https://gist.github.com/rcorreia/2362544), but it does not require jQuery.


Install
-------
```shell
npm install --save-dev html-dnd
```


Compatibility
-------------
[![Sauce Test Status](https://saucelabs.com/browser-matrix/html-dnd.svg)](https://saucelabs.com/u/html-dnd)


Usage
-----
The first two arguments are required and are the `draggable` and `droppable` elements or reference to elements depends on the library the script runs in. see examples below.

The third argument is `dndSimulateConfig` and it is mandatory.
It includes two mandatory configs: `dragOffset` and `dropOffset`.
If present, they will offset the mouse by the specified position at the relevant DND events.
Otherwise, the mouse will be centered for the omitted configs.

Both of the configs expect an array with the size of 2 that determines offset `left` and `top` from the top and left of the relevant elements.

```
var dndSimulateConfig = {
  dragOffset: [100, 200],
  dropOffset: [20, 30]
};
```

### For selenium-webdriver

```javascript
var dragAndDrop = require('html-dnd').code;
var webdriver = require('selenium-webdriver');
var By = webdriver.By;

var driver = new webdriver.Builder()
  .forBrowser('firefox')
  .build();

driver.get('http://example.com');

var draggable = driver.findElement(By.id('draggable'));
var droppable = driver.findElement(By.id('droppable'));

var dndSimulateConfig = {
  dragOffset: [100, 200],
  dropOffset: [20, 30]
};

driver.executeScript(dragAndDrop, draggable, droppable, dndSimulateConfig);

driver.quit();
```


### For WebdriverIO

```javascript
var dragAndDrop = require('html-dnd').codeForSelectors;
var webdriverio = require('webdriverio');
var options = { desiredCapabilities: { browserName: 'chrome' } };
var client = webdriverio.remote(options);

client
  .init()
  .url('http://example.com')
  .execute(dragAndDrop, '#draggable', '#droppable')
  .end();
```


### For Nightwatch.js

```javascript
var dragAndDrop = require('html-dnd').codeForSelectors;

module.exports = {
  'drag and drop': function(browser) {
    
    var dndSimulateConfig = {
      dragOffset: [20, 30]
    };
    
    browser
      .url('http://example.com')
      .execute(dragAndDrop, ['#draggable', '#droppable', dndSimulateConfig])
      .end();
  }
};
```


### With Typescript

```typescript
import {code as dragAndDrop, DndSimulateConfig} from 'html-dnd';

var dndSimulateConfig: DndSimulateConfig = {
  dropOffset: [20, 20]
};

driver.executeScript(dragAndDrop, draggable, droppable, dndSimulateConfig);
```


See also
--------

- [Issue 3604: HTML5 Drag and Drop with Selenium Webdriver](https://code.google.com/p/selenium/issues/detail?id=3604)


License
-------

MIT (c) 2017 Kuniwak
