Pinkistate
==========

Stand-alone & un-opinionated/framework-agnostic micro-state management tool

Pinkistate is great for managing application state(s) in a generic manner therefore it makes it easy to migrate/refactor your state-management.
You have the freedom to implement a redux action-like transformer method or a more generic, event-based based one with custom fields.

### Concept

One minimal source file that is easily understandable, debuggable and includable in the source code.
Transpilation is completely up to you.

Minimalistic API with 3 methods:
- Trigger - trigger state transform with payload
- Transform - merge payload into state
- Read - return actual state

**!!! IMPORTANT !!!** Pinkistate is - currently - a Node module so you must include the source file in your project's build if you're using it for the browser environment!

### Micro state

In order to create a micro state you need 2 prerequisites
1. A default state
1. A change handler - this gets invoked every time the state changes

```js
const pinkistate = require('pinkistate');


// Micro state change handler
const onChange = (newState, oldState, triggerPayload) => {
    // do something when state changes
};

// create micro-state with default state and onChange handler
const defaultState = {};
const myState = pinkistate(defaultState, onChange);
```

You can also deconstruct the state API if need be

```js
const { trigger, transform, read } = ps(defaultState, onChange);
```

### defaultState

Default state can be any value except `undefined`.

```js
const defaultState = {};
```

It can even be a `function` if need be.
In this case the function is invoked every time the batched triggers are executed.
Bear in mind that `function` type default states might introduce a fair amount of confusion into your code base.
However they are a way to compose/group/nest multiple micro-state changes into one change handler (higher-order state).

An example would be

```js
const childState1 = ps({}, (state) => {
    // do some thing
});

const childState2 = ps({}, (state) => {
    // do another something
});

const defaultState = () => {
    const cState1 = childState1.read();
    const cState2 = childState2.read();
    return { ...cState1, ...cState2 };
};

const parentState = pinkistate(defaultState, (newState, oldState) => {
    // oldState is the return value of the defaultState method above
    // newState is the modified default state
});
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

> **Note:** in order to invoke the `onchange` callback method, the state must be a different reference from the old one!

```js
myState.transform((state, payload) => ({ ...state, ...payload }));
myState.trigger({ sayHi: "Hello World!" });
```

### License
[MIT licensed](./LICENSE)