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

`mainFlow.steps` is a list of states of your app execution.
The App execution starts by `mainFlow.done('start')`. This function summarizes the current state.

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
if (mainFlow.isDone('database is OK')) { // getting data from the base... }
```


## A Constructor parameters
`Flow` accepts one boolean argument that may turn on the flow logging.
```js
const mainFlow = new Flow(true); // console logging is turned on
```
This is how it looks:
```
-->  start 

-->  config is OK 

-->  database is OK 

-->  interface is ready

```