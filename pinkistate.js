/**
 * Create a micro-state scope
 * @param {*} [state]
 * @returns {{transform: (function(Function): number), read: (function()), onchange: (function(Function): Function), trigger: trigger}}
 */
module.exports = (state = {}) => {
  if (typeof state === 'function') throw Error("Default state cannot be a function!");
  const transformers = [];
  let triggerQueue = [];
  let triggerTimeout;
  let _onChange = () => {};

  const _triggerPayload = (payload) => {
    const oldState = state;
    transformers.forEach(fn => state = (fn(state, payload) || state));
    if (oldState !== state) _onChange(state, oldState, payload);
  };

  const _triggerQueued = () => {
    triggerTimeout = clearTimeout(triggerTimeout);
    triggerQueue.forEach(_triggerPayload);
    triggerQueue = [];
  };

  /**
   * Return actual state
   * @public
   * @returns {*}
   */
  const read = () => state;

  /**
   * Trigger state transform with payload
   * (Batch and queue payloads to be triggered together on the next execution frame)
   * @public
   * @param {object} [payload]
   */
  const trigger = (payload) => {
    if (typeof payload === 'function') return payload(trigger);
    triggerQueue.push(payload);
    if (!triggerTimeout) triggerTimeout = setTimeout(_triggerQueued, 0);
  };

  /**
   * Register a transformer function to merge payloads into the state
   * @public
   * @param {function} fn
   */
  const transform = (fn) => {
    if (typeof fn !== 'function') throw Error("transformer must be a function!");
    transformers.push(fn);
  };

  /**
   * Register listener for when the state changes
   * @public
   * @param {function} fn
   */
  const onchange = (fn) => {
    if (typeof fn !== 'function') throw Error("onchange listener must be a function!");
    _onChange = fn;
  };

  return { read, trigger, transform, onchange };
};
