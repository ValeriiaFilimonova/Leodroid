'use strict';

const _ = require('lodash');
const redis = require('redis');
const logger = require('log4js').getLogger('SynthesisService');
const executor = require('./CommandExecutor');
const synthesiser = require('./EspeakWrapper');

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    db: 0,
    enable_offline_queue: false,
});

const terminationHandler = function () {
    logger.info("Service stopped");
    redisClient.quit();
    process.exit(0);
};

const errorHandler = function (err) {
    if (!_.isEmpty(err)) {
        logger.error(err);
        process.exit(1);
    }
};

process.on('SIGINT', terminationHandler);
process.on('SIGTERM', terminationHandler);

redisClient.on('error', errorHandler);

redisClient.on('message', (channel, message) => {
    try {
        switch (channel) {
            case 'voice-commands': {
                return executor.execute(message);
            }
            case 'text-synthesis': {
                logger.info('Received the message:', `"${message}"`);
                return synthesiser.speak(message);
            }
        }
    } catch (err) {
        errorHandler(err);
    }
});

redisClient.on('ready', (err) => {
    if (err) {
        errorHandler(err);
        process.exit(1);
    }

    logger.info('Service started');
    redisClient.subscribe('voice-commands', errorHandler);
    redisClient.subscribe('text-synthesis', errorHandler);
});
