
const chai = require('chai'),
      chaiAsPromised = require("chai-as-promised");

chai.should();
chai.use(chaiAsPromised);

const promiseQueue = require('./');

console.log('mocha test');

describe('create promiseQueue with Inifinity', () => {
  let queue;

  beforeEach(() => {
    queue = new promiseQueue(5);
  });

  it('returns the queue length', () => {
    queue.maxPendingPromises.should.equal(5);
  });

  it('add one item', () => {
    queue.add(() => 42);
    queue.pendingLength.should.equal(1);
  });

  it('eventually get value',
    () => queue.add(() => 42).should.eventually.equal(42)
  );
});

describe('create promiseQueue with limited length', () => {
  let queue;

  beforeEach(() => {
    queue = new promiseQueue(2, 3);
  });

  it('returns the queue length', () => {
    queue.maxPendingPromises.should.equal(2);
    queue.maxQueuedPromises.should.equal(3);
  });

  it('add one item', () => {
    queue.add(() => 42);
    queue.add(() => Promise.resolve(42));
    queue.add(() => Promise.resolve(42));
    queue.pendingLength.should.equal(2);
    queue.queueLength.should.equal(1);
  });

  it('throw queue limit exception', () => {
    queue.add(() => 42);
    queue.add(() => Promise.resolve(42));
    queue.add(() => Promise.resolve(42));
    queue.pendingLength.should.equal(2);
    queue.queueLength.should.equal(1);
    queue.add(() => 42);
    queue.add(() => 42);
    queue.queueLength.should.equal(3);

    queue.add(() => 42);
    queue.queueLength.should.equal(3);

    return queue.add(() => 42).should.be.rejectedWith(Error, 'Error: Queue limit(3) reached');
  });
});
