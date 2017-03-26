'use strict';

const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    // family: 4,
    db: 0,
    enable_offline_queue: false,
});

redisClient.on('ready', err => {
    // logger.error(logEntries.application.redis.redisError, { error: err });
});

redisClient.on('error', err => {
    // logger.error(logEntries.application.redis.redisError, { error: err });
});

module.exports = redisClient;
