# promise-queue [![Build Status](https://travis-ci.org/c0b/promise-queue.svg?branch=master)](https://travis-ci.org/c0b/promise-queue) [![CircleCI](https://circleci.com/gh/c0b/promise-queue.svg?style=svg)](https://circleci.com/gh/c0b/promise-queue) [![codecov](https://codecov.io/gh/c0b/promise-queue/branch/master/graph/badge.svg)](https://codecov.io/gl/c0b/promise-queue) [![Coverage Status](https://coveralls.io/repos/github/c0b/promise-queue/badge.svg)](https://coveralls.io/github/c0b/promise-queue)

Promise based Queue, written in ES6, works on Node v6+

## API Usage

 - `import Queue from 'promise-queue-es6'`
 - `new Queue(Number maxConcurrent, Number maxQueued): Queue` max numbers are default to Infinity, means unlimited
 - `Queue#add(Function generator): Promise` - adds function argument that generates a promise to the queue`
 - `Queue#pendingLength` - read only property to get number of current pending promises
 - `Queue#queueLength` - read only property to get number of current queued promises

## Example
