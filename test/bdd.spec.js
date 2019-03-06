const pinkistate = require('../pinkistate');

const { expect } = require('chai');


describe('Can set up a store', () => {
  
  it('with object', () => {
    const defaultValue = { a: 1 };
    const state = pinkistate(defaultValue);
    
    expect(state.read()).to.equal(defaultValue);
  });
  
  it('with function', () => {
    const obj = { a: 1 };
    const defaultValue = () => obj;
    
    const state = pinkistate(defaultValue);
    
    expect(state.read()).to.equal(obj);
  });
  
});

describe('Can trigger', () => {
  
  it('onchange is called with correct arguments', (done) => {
    const defaultValue = { a: {} };
    const payload = { b: [] };
    
    const state = pinkistate(defaultValue, (newState, oldState, triggerPayload) => {
      expect(newState).to.deep.equal({ a: defaultValue.a, b: payload.b });
      expect(oldState).to.equal(defaultValue);
      expect(triggerPayload).to.equal(payload);
      done();
    });
    
    state.transform((s, p) => ({ ...s, ...p }));
    
    state.trigger(payload);
  });

  it('transform is called with correct arguments', (done) => {
    const defaultValue = { a: {} };
    const payload = { b: [] };

    const state = pinkistate(defaultValue, () => done());

    let transformedState;
    state.transform((s, p) => {
      expect(s).to.equal(defaultValue);
      expect(p).to.equal(payload);
      return transformedState = { ...s, ...p };
    });

    state.transform((s, p) => {
      expect(s).to.equal(transformedState);
      expect(p).to.equal(payload);
      return transformedState;
    });

    state.trigger(payload);
  });

  it('asynchronously', (done) => {
    const defaultValue = { a: {} };
    const payload = { b: [] };

    const state = pinkistate(defaultValue, () => done());

    state.transform((s, p) => ({ ...s, ...p }));

    state.trigger(trigger => {
      setTimeout(() => trigger(payload), 40);
    });
  });

});

