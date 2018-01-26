Flow
====

"**Flow**" is a simple way to write readable asynchronous code using just callbacks.

##Usage
```
const Flow = require('flow-code-description');
const mainFlow = new Flow(true);

mainFlow.steps = {
    'start': getConfig,
    'config is OK': checkDataBase,
    'database is OK': getInterface,
    'interface is geady': renderInterface,
    // ...
}
mainFlow.result('start');

function getConfig() {
	// ...
```

`mainFlow.steps` is a list of states of your app.
The App execution starts by `mainFlow.result('start')`. This function sets the current state.
 
Step `start` means: "some function had finished it's execution and the App stepped to start. Then a function `getConfig` must be executed".

A function may return its result to the second argument:
```
function getInterface() {
	let interface = {};
	// some actions ...
	mainFlow.result('interface is geady', interface);
}
```
This result will be given to `renderInterface`:
```
function renderInterface(interface) {
	console.log(interface);
	// ...
	mainFlow.result('interface is rendered');
}
```

##Constructor
`Flow` accepts one boolean argument that may turn on the flow logging.
```
const mainFlow = new Flow(true); // console logging turned on
const mainFlow = new Flow(false);  // logging turned off
```

