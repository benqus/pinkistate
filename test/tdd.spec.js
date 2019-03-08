const pinkistate = require("../pinkistate");

const sinon = require("sinon");
const { assert } = require("chai");

describe("transform", () => {
  
  let clock;
  
  before(() => {
    clock = sinon.useFakeTimers({
      toFake: ["setTimeout"]
    });
  });
  
  afterEach(() => {
    clock.runAll();
  });
  
  after(() => {
    clock.restore();
  });
  
  it("single", () => {
    const { transform, trigger } = pinkistate(1);
    const spy = sinon.spy();
    
    transform(spy);
    trigger(2);
    
    clock.next();
    
    assert.isOk(spy.called);
    assert.isOk(spy.calledWith(1, 2));
  });
  
  it("multiple", () => {
    const { transform, trigger } = pinkistate(1);
    const payload = {};
    const spy1 = sinon.spy((state, payload) => payload); // return payload only
    const spy2 = sinon.spy();
    
    transform(spy1);
    transform(spy2);
    trigger(payload);
    
    clock.next();
    
    assert.isOk(spy1.called);
    assert.isOk(spy1.calledWith(1, payload));
    assert.isOk(spy1.calledBefore(spy2));
    
    assert.isOk(spy2.called);
    assert.isOk(spy2.calledWith(payload, payload));
    assert.isOk(spy2.calledAfter(spy1));
  });
  
  it("won't accept anything but function as argument", () => {
    const { transform } = pinkistate(1);
    const spy = sinon.spy(transform);
    
    const args = [2, "", {}, [], null, () => {}];
    
    args.forEach(arg => {
      try {
        spy(arg);
      } catch(e) {}
    });
    
    assert.isOk(spy.exceptions[0]);
    assert.isOk(spy.exceptions[1]);
    assert.isOk(spy.exceptions[2]);
    assert.isOk(spy.exceptions[3]);
    assert.isOk(spy.exceptions[4]);
    assert.isUndefined(spy.exceptions[5]);
  });
  
});

describe("onchange", () => {

  it("won't accept anything but function as argument", () => {
    const { onchange } = pinkistate(1);
    const spy = sinon.spy(onchange);

    const args = [2, "", {}, [], null, () => {}];

    args.forEach(arg => {
      try {
        spy(arg);
      } catch(e) {}
    });

    assert.isOk(spy.exceptions[0]);
    assert.isOk(spy.exceptions[1]);
    assert.isOk(spy.exceptions[2]);
    assert.isOk(spy.exceptions[3]);
    assert.isOk(spy.exceptions[4]);
    assert.isUndefined(spy.exceptions[5]);
  });

});

describe("read", () => {

  it("returns state", () => {
    const state = {};
    const { read } = pinkistate(state);
    
    assert.equal(read(), state);
  });

});

describe("trigger", () => {

  it("function", () => {
    const state = {};
    const { trigger } = pinkistate(state);
    const fake = sinon.fake();
    
    trigger(fake);
    
    assert.isOk(fake.called);
    assert.isOk(fake.calledWith(trigger));
  });

});
