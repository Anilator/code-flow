# Flow

"**Flow**" is a simple way to write readable asynchronous code using just callbacks.

**Warning**: this software got the stable version and will not be supported anymore.
The author decided to replace this lib by another, more powerful one ([brief-async](https://github.com/klimcode/brief-async)).

This lib is used by [Notekeeper](https://github.com/klimcode/notekeeper) which is also discontinued.

## Usage

```js
const Flow = require('flow-code-description');
const mainFlow = new Flow();
mainFlow.steps = {
    'start': getConfig,
    'config is OK': checkDataBase,
    'database is OK': getInterface,
    'interface is ready': renderInterface,
    // ...
}
mainFlow.start();

function getConfig(done) {
    // ...
```

`mainFlow.steps` is a list of steps of your app's execution.
The App's execution starts by `mainFlow.start()`. A function `done` summarizes the current step.

A result of the finished step may be specified in the second argument of a `done` callback:

```js
function getInterface(done) {
    let interface = {};
    // some actions ...
    done('interface is ready', interface);
}
```

This result will be transmitted to the next function (it's `renderInterface` in this case):

```js
function renderInterface(done, interface) {
    console.log(interface);
    // ...
    done('interface is rendered');
}
```

.

## Steps

A finished step may execute several functions asynchronously:

```js
mainFlow.steps = {
    'start': getConfig,
    'config is OK': [checkDataBase, getInterface]
    // ...
}
```

.

## Asynchronous race

Beware of setting one function as a result of several different steps:

```js
mainFlow.steps = {
    'file 1 is read': mixFiles,
    'file 2 is read': mixFiles,
}
```

A function may depend on data received from different asynchronous sources `mixFiles (file1, file2)`. **Flow** does not handle this case. You may store that data somewhere and check it manually.

.

## A Constructor parameters

`Flow` accepts an Object with settings as an argument.

```js
const defParams = {
    isLogging: true, // steps logging is turned on
    isErrors: true,  // errors logging is turned on
    logStyle: '\x1b[32m%s\x1b[0m', // green font color (Node.js)
    errStyle: '\x1b[31m%s\x1b[0m', // red font color (Node.js)
    logName: '--> ' // a prefix before each log message
}
const mainFlow = new Flow(defParams);
```

## Methods

`.done(stepName, results)` -- marks the current step as finished and calls functions of the next step.

`.start(initialData)` -- starts the flow execution (tha same as `.done('start')`).
