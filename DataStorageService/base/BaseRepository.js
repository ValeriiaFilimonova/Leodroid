'use strict';

const redis = require('./RedisClient');

class BaseRepository {
    constructor() {
        this._redis = redis;

        this._servicePrefix = "service.";
        this._allServicesKey = this._servicePrefix + "all";
    }

    getAllServices() {
        return this._redis.smembersAsync(this._allServicesKey);
    }

    addService(serviceName) {
        return this._redis.saddAsync(this._allServicesKey, serviceName);
    }

    removeService(serviceName) {
        return this._redis.sremAsync(this._allServicesKey, serviceName);
    }

    _getApplicationKey(appName) {
        return `app.${appName}.service`;
    }
}

module.exports = BaseRepository;
