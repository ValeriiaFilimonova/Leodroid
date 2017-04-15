'use strict';

const redis = require('redis');
const bluebird = require('bluebird');
const handler = require('./TerminationHandler');

bluebird.promisifyAll(redis.RedisClient.prototype);

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    db: 0,
    enable_offline_queue: false,
});
redisClient.on('error', handler.handleErrorWithExit);

module.exports = redisClient;
