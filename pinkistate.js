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