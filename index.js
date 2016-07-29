
// a modified library inspired by promise-queue
// https://github.com/azproduction/promise-queue/blob/master/lib/index.js

export default class Queue {
  constructor(maxPendingPromises = Infinity, maxQueuedPromises = Infinity) {
    Object.assign(this, {
      pendingPromises: 0,
      maxPendingPromises, maxQueuedPromises,
      queue: [],
    });
  }

  add(promiseGenerator) {
    return new Promise((resolve, reject) => {
      if (this.queue.length >= this.maxQueuedPromises) {
        throw new Error(`Queue limit(${this.maxQueuedPromises}) reached`);
      }
      this.queue.push({ promiseGenerator, resolve, reject });
      this._dequeue();
    });
  }

  _dequeue() {
    if (this.pendingPromises >= this.maxPendingPromises) return;

    const item = this.queue.shift();
    if (!item) return;

    this.pendingPromises++;
    Promise.resolve(item.promiseGenerator())
      .then(item.resolve, item.reject)
      .then(() => {
        this.pendingPromises--;
        this._dequeue();
      });
  }

  get pendingLength() { return this.pendingPromises; }
  get queueLength() { return this.queue.length; }
}
