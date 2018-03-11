Flow
====

"**Flow**" is a simple way to write readable asynchronous code using just callbacks.

## Usage
```js
const Flow = require('flow-code-description');
const mainFlow = new Flow(true);

mainFlow.steps = {
    'start': getConfig,
    'config is OK': checkDataBase,
    'database is OK': getInterface,
    'interface is ready': renderInterface,
    // ...
}
mainFlow.done('start');

function getConfig() {
    // ...
```

`mainFlow.steps` is a list of steps of your app execution.
The App execution starts by `mainFlow.done('start')`. A function `done` summarizes the current step.

The meaning of `mainFlow.done('start')` is: "the program has finished a step called "start". Then a function specified in `mainFlow.steps` must be executed. This function is `getConfig`".

A result of the finished step may be specified in the second argument:
```js
function getInterface() {
    let interface = {};
    // some actions ...
    mainFlow.done('interface is ready', interface);
}
```

This result will be transmitted to the next function (it's `renderInterface` in this case):
```js
function renderInterface(interface) {
    console.log(interface);
    // ...
    mainFlow.done('interface is rendered');
}
```

.


## Steps
A finished step may execute several functions asynchronously:
```
mainFlow.steps = {
    'start': getConfig,
    'config is OK': [checkDataBase, getInterface]
    // ...
}
```

You may check if a step finished:
```
if (mainFlow['database is OK'].isDone) { // getting data from the base... }
```

.

## Asynchronous race
Beware of setting one function as a result of several different steps:
```
mainFlow.steps = {
    'file 1 is read': mixFiles,
    'file 2 is read': mixFiles,
}
```
A function may depend on data received from different asynchronous sources `mixFiles (file1, file2)`. Current version of **Flow** does not handle this case. You may store that data and check it manually.

.


## A Constructor parameters
`Flow` accepts an Object with settings as an argument.
```js
const defParams = {
    isLogging: true, // steps logging is turned on
    isErrors: true,  // errors logging is turned on
    logStyle: '\x1b[32m%s\x1b[0m', // green font color (Node.js)
    errStyle: '\x1b[31m%s\x1b[0m', // red font color (Node.js)
}
const mainFlow = new Flow (defParams);
```
