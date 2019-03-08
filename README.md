Pinkistate
==========

Stand-alone & un-opinionated/framework-agnostic micro-state management tool

Pinkistate is great for managing application state(s) in a generic manner therefore it makes it easy to migrate/refactor your state-management.
You have the freedom to implement a redux action-like transformer method or a more generic, event-based based one with custom fields.

A good example/case for micro-states is a system where a user can be logged in from multiple devices at once that need to share the user state - via WebSockets maybe.  
In this case a user client entity can aggregate the state changes into a micro-state and broadcast them to all the client connections.
Of course this all depends on software design, this is just one possible example. :sunglasses: 

### Concept

One minimal source file that is easily understandable, debuggable and includable in the source code.
Transpilation is completely up to you.

Minimalistic API with 4 methods:
- Trigger - trigger state transform with payload
- Transform - merge payload into state
- Change - callback for when the state changes
- Read - return actual state

**!!! IMPORTANT !!!** Pinkistate is - currently - a Node module so you must include the source file in your project's build if you're using it for the browser environment!

### Micro state

In order to create a micro state you need 2 things
1. A default state (optional)
1. A change handler - this gets invoked every time the state changes

```js
const pinkistate = require('pinkistate');

// create micro-state with default state
const defaultState = {};
const myState = pinkistate(defaultState);

// micro-state change handler
const onchange = (newState, oldState, triggerPayload) => {
    // do something when state changes
};

// register onchange handler
myState.onchange(onchange);
```

You can also deconstruct the state API if need be

```js
const { trigger, transform, read, onchange } = ps(defaultState, onChange);
```

### defaultState

Default state can be any value except `undefined`.

`undefined` will default to an empty object (`{}`);

```js
const defaultState = {};
```

### onchange

Change handler is used to notify your View/Component tree to re-render itself or to distribute a state via a socket connection, etc.

The state change handler receives 3 arguments
1. The new state
1. The old state
1. The payload that triggered the change

### Triggers

Triggers are methods that take a payload and invoke all registered transformers.
Like actions in redux except in a more generic way - again, you can implement your own logic around this.

Each trigger is registered and batched to be executed in the next frame.

```js
myState.trigger({ hello: "World!" });
```

Triggers can be asynchronous as well.

```js
const myTrigger = (trigger) => {
    const sayHi = "Hello World!";
    setTimeout(() => trigger({ sayHi }), 1000);
};

myState.trigger(myTrigger);
```

### Transformers

Transformers are methods that get invoked with the latest state, the old state and payload that triggered them.
Think of them as redux reducers - but in a more generic way.
There's nothing stopping you from using a `type` field in your payload and use the tool similar to how a redux reducer works or to implement your own logic around this.

> **Note:** in order to invoke the `onchange` callback method, the state must be a different value or object reference from the old one!

```js
// this will work
myState.transform((state, payload) => ({ ...state, ...payload }));
myState.trigger({ sayHi: "Hello World!" });

// this will work as well
myState.transform((state, payload) => ({ ...payload }));
myState.trigger({ sayHi: "Hello World!" });

// this WON'T work!
myState.transform((state, payload) => state);
myState.trigger({ sayHi: "Hello World!" });
```

### License
[MIT licensed](./LICENSE)