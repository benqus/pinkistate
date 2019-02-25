const createState = require('../pinkistate');

const displayTime = document.getElementById('display-time');
const renderTime = ms => displayTime.innerHTML = new Date(ms);
renderTime(Date.now());


// micro-state change handler
const onChange = (newState, oldState, payload) => {
  if (newState.time) {
    renderTime(newState.time);
  } else {
    console.log(payload.int);
  }
};

// create micro-state with default value and change handler, expose API only
const {trigger, transform} = createState({time: Date.now()}, onChange);

// register a transformer method
transform((state, {time}) => ({...state, time}));

// set up interval for timer
setInterval(() => {
  const time = Date.now();
  // trigger (queue) change in micro-state
  trigger({time});
  // queue more changes
  trigger({int: 1});
  trigger({int: 2});
  trigger({int: 3});
}, 1000);
