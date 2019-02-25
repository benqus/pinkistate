(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../pinkistate":2}],2:[function(require,module,exports){
/**
 * Create a micro-state scope
 * @param {*|function} state
 * @param {function} onchange
 * @returns {{ trigger: (function(*)), transform: (function(Function)), read: (function()) }}
 */
module.exports = (state = {}, onchange = () => {}) => {
    const executeBeforeTrigger = (typeof state === 'function');
    const transformers = [];
    let triggerQueue = [];
    let triggerQueueTimeout;

    const _triggerPayload = (state, payload) => {
        const oldState = state;
        transformers.forEach(fn => state = (fn(state, payload) || state));
        if (oldState !== state) onchange(state, oldState, payload);
    };

    const _triggerQueued = () => {
        const _state = (executeBeforeTrigger ? state() : state);
        triggerQueueTimeout = clearTimeout(triggerQueueTimeout);
        triggerQueue.forEach(payload => _triggerPayload(_state, payload));
        triggerQueue = [];
    };

    /**
     * Return actual state
     */
    const read = () => state;

    /**
     * Trigger state transform with payload
     * (Batch and queue payloads to be triggered together on the next execution frame)
     * @param {object} payload
     */
    const trigger = (payload) => {
        if (typeof payload === 'function') return payload(trigger);
        triggerQueue.push(payload);
        if (triggerQueueTimeout) return;
        triggerQueueTimeout = setTimeout(() => _triggerQueued(), 0);
    };

    /**
     * Register a transformer function to merge payloads into the state
     * @param {function} fn
     */
    const transform = (fn) => transformers.push(fn);

    return { read, trigger, transform };
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3RpbWVyLmpzIiwicGlua2lzdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGNyZWF0ZVN0YXRlID0gcmVxdWlyZSgnLi4vcGlua2lzdGF0ZScpO1xuXG5jb25zdCBkaXNwbGF5VGltZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXNwbGF5LXRpbWUnKTtcbmNvbnN0IHJlbmRlclRpbWUgPSBtcyA9PiBkaXNwbGF5VGltZS5pbm5lckhUTUwgPSBuZXcgRGF0ZShtcyk7XG5yZW5kZXJUaW1lKERhdGUubm93KCkpO1xuXG5cbi8vIG1pY3JvLXN0YXRlIGNoYW5nZSBoYW5kbGVyXG5jb25zdCBvbkNoYW5nZSA9IChuZXdTdGF0ZSwgb2xkU3RhdGUsIHBheWxvYWQpID0+IHtcbiAgaWYgKG5ld1N0YXRlLnRpbWUpIHtcbiAgICByZW5kZXJUaW1lKG5ld1N0YXRlLnRpbWUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKHBheWxvYWQuaW50KTtcbiAgfVxufTtcblxuLy8gY3JlYXRlIG1pY3JvLXN0YXRlIHdpdGggZGVmYXVsdCB2YWx1ZSBhbmQgY2hhbmdlIGhhbmRsZXIsIGV4cG9zZSBBUEkgb25seVxuY29uc3Qge3RyaWdnZXIsIHRyYW5zZm9ybX0gPSBjcmVhdGVTdGF0ZSh7dGltZTogRGF0ZS5ub3coKX0sIG9uQ2hhbmdlKTtcblxuLy8gcmVnaXN0ZXIgYSB0cmFuc2Zvcm1lciBtZXRob2RcbnRyYW5zZm9ybSgoc3RhdGUsIHt0aW1lfSkgPT4gKHsuLi5zdGF0ZSwgdGltZX0pKTtcblxuLy8gc2V0IHVwIGludGVydmFsIGZvciB0aW1lclxuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgLy8gdHJpZ2dlciAocXVldWUpIGNoYW5nZSBpbiBtaWNyby1zdGF0ZVxuICB0cmlnZ2VyKHt0aW1lfSk7XG4gIC8vIHF1ZXVlIG1vcmUgY2hhbmdlc1xuICB0cmlnZ2VyKHtpbnQ6IDF9KTtcbiAgdHJpZ2dlcih7aW50OiAyfSk7XG4gIHRyaWdnZXIoe2ludDogM30pO1xufSwgMTAwMCk7XG4iLCIvKipcbiAqIENyZWF0ZSBhIG1pY3JvLXN0YXRlIHNjb3BlXG4gKiBAcGFyYW0geyp8ZnVuY3Rpb259IHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmNoYW5nZVxuICogQHJldHVybnMge3sgdHJpZ2dlcjogKGZ1bmN0aW9uKCopKSwgdHJhbnNmb3JtOiAoZnVuY3Rpb24oRnVuY3Rpb24pKSwgcmVhZDogKGZ1bmN0aW9uKCkpIH19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKHN0YXRlID0ge30sIG9uY2hhbmdlID0gKCkgPT4ge30pID0+IHtcbiAgICBjb25zdCBleGVjdXRlQmVmb3JlVHJpZ2dlciA9ICh0eXBlb2Ygc3RhdGUgPT09ICdmdW5jdGlvbicpO1xuICAgIGNvbnN0IHRyYW5zZm9ybWVycyA9IFtdO1xuICAgIGxldCB0cmlnZ2VyUXVldWUgPSBbXTtcbiAgICBsZXQgdHJpZ2dlclF1ZXVlVGltZW91dDtcblxuICAgIGNvbnN0IF90cmlnZ2VyUGF5bG9hZCA9IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCBvbGRTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0cmFuc2Zvcm1lcnMuZm9yRWFjaChmbiA9PiBzdGF0ZSA9IChmbihzdGF0ZSwgcGF5bG9hZCkgfHwgc3RhdGUpKTtcbiAgICAgICAgaWYgKG9sZFN0YXRlICE9PSBzdGF0ZSkgb25jaGFuZ2Uoc3RhdGUsIG9sZFN0YXRlLCBwYXlsb2FkKTtcbiAgICB9O1xuXG4gICAgY29uc3QgX3RyaWdnZXJRdWV1ZWQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IF9zdGF0ZSA9IChleGVjdXRlQmVmb3JlVHJpZ2dlciA/IHN0YXRlKCkgOiBzdGF0ZSk7XG4gICAgICAgIHRyaWdnZXJRdWV1ZVRpbWVvdXQgPSBjbGVhclRpbWVvdXQodHJpZ2dlclF1ZXVlVGltZW91dCk7XG4gICAgICAgIHRyaWdnZXJRdWV1ZS5mb3JFYWNoKHBheWxvYWQgPT4gX3RyaWdnZXJQYXlsb2FkKF9zdGF0ZSwgcGF5bG9hZCkpO1xuICAgICAgICB0cmlnZ2VyUXVldWUgPSBbXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGFjdHVhbCBzdGF0ZVxuICAgICAqL1xuICAgIGNvbnN0IHJlYWQgPSAoKSA9PiBzdGF0ZTtcblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgc3RhdGUgdHJhbnNmb3JtIHdpdGggcGF5bG9hZFxuICAgICAqIChCYXRjaCBhbmQgcXVldWUgcGF5bG9hZHMgdG8gYmUgdHJpZ2dlcmVkIHRvZ2V0aGVyIG9uIHRoZSBuZXh0IGV4ZWN1dGlvbiBmcmFtZSlcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgICAqL1xuICAgIGNvbnN0IHRyaWdnZXIgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQgPT09ICdmdW5jdGlvbicpIHJldHVybiBwYXlsb2FkKHRyaWdnZXIpO1xuICAgICAgICB0cmlnZ2VyUXVldWUucHVzaChwYXlsb2FkKTtcbiAgICAgICAgaWYgKHRyaWdnZXJRdWV1ZVRpbWVvdXQpIHJldHVybjtcbiAgICAgICAgdHJpZ2dlclF1ZXVlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gX3RyaWdnZXJRdWV1ZWQoKSwgMCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgdHJhbnNmb3JtZXIgZnVuY3Rpb24gdG8gbWVyZ2UgcGF5bG9hZHMgaW50byB0aGUgc3RhdGVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuICAgICAqL1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IChmbikgPT4gdHJhbnNmb3JtZXJzLnB1c2goZm4pO1xuXG4gICAgcmV0dXJuIHsgcmVhZCwgdHJpZ2dlciwgdHJhbnNmb3JtIH07XG59OyJdfQ==
