
// a modified library inspired by promise-queue
// https://github.com/azproduction/promise-queue/blob/master/lib/index.js

/* global define, Promise */
!function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports && typeof require === 'function') {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.Queue = factory();
  }
}
(this, function () {
  return class Queue {
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
        .then(value => (this.pendingPromises--, value))
        .then(item.resolve, item.reject)
        .then(this._dequeue.bind(this));
    }

    get pendingLength() { return this.pendingPromises; }
    get queueLength() { return this.queue.length; }
  }
});
