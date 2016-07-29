
import './use-chai-as-promised.js';

import Queue from './index.js';

// console.log('mocha test', Queue);

describe('create promiseQueue with Inifinity', () => {
  let queue;

  beforeEach(() => {
    queue = new Queue(5);
  });

  it('returns the queue length', () => {
    queue.maxPendingPromises.should.equal(5);
  });

  it('add one item', () => {
    queue.add(() => 42);
    queue.pendingLength.should.equal(1);
  });

  it('eventually get value',
    () => queue.add(() => Promise.resolve(42)).should.eventually.equal(42)
  );

  it('eventually timeout resolve value', () => {
    return queue.add(
        () => new Promise((fulfilled, rejected) =>
          setTimeout(() => fulfilled(42), 100))
      ).should.eventually.equal(42);
  });

  it('eventually timeout reject value', () => {
    return queue.add(
        () => new Promise((fulfilled, rejected) => {
          setTimeout(() => rejected(42), 100); })
      ).should.be.rejected.and.become(42);
  });
});

describe('create promiseQueue with limited length', () => {
  let queue;

  beforeEach(() => {
    queue = new Queue(2, 3);
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

  it('expect one item', () => {
    return queue.add(() => 42).should.eventually.equal(42);
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
