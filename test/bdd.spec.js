const pinkistate = require("../pinkistate");

const { expect } = require("chai");

describe("Can set up a store", () => {
  
  it("with object", () => {
    const defaultValue = { a: 1 };
    const { read } = pinkistate(defaultValue);
    
    expect(read()).to.equal(defaultValue);
  });
  
});

describe("Can trigger", () => {
  
  it("onchange is called with correct arguments", (done) => {
    const defaultValue = { a: {} };
    const payload = { b: [] };
    
    const { onchange, transform, trigger } = pinkistate(defaultValue);
    onchange((newState, oldState, triggerPayload) => {
      expect(newState).to.deep.equal({ a: defaultValue.a, b: payload.b });
      expect(oldState).to.equal(defaultValue);
      expect(triggerPayload).to.equal(payload);
      done();
    });
    
    transform((s, p) => ({ ...s, ...p }));
    
    trigger(payload);
  });

  it("transform is called with correct arguments", (done) => {
    const defaultValue = { a: {} };
    const payload = { b: [] };

    let transformedState;
    
    const { onchange, transform, trigger, read } = pinkistate(defaultValue);
    
    onchange(() => {
      expect(read()).to.equal(transformedState);
      done();
    });

    transform((s, p) => {
      expect(s).to.equal(defaultValue);
      expect(p).to.equal(payload);
      return transformedState = { ...s, ...p };
    });

    transform((s, p) => {
      expect(s).to.equal(transformedState);
      expect(p).to.equal(payload);
      return transformedState;
    });

    trigger(payload);
  });

  it("asynchronously", (done) => {
    const defaultValue = { a: {} };
    const payload = { b: [] };

    const { onchange, transform, trigger } = pinkistate(defaultValue);
    onchange(() => done());

    transform((s, p) => ({ ...s, ...p }));

    trigger(trigger => setTimeout(() => trigger(payload), 40));
  });

});

