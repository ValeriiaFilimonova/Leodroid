'use strict';

const redis = require('../RedisClient');

class BaseRepository {
    constructor() {
        this._redis = redis;

        this._servicePrefix = "service.";
        this._allServicesKey = this._servicePrefix + "all";
    }

    get client() {
        return this._redis;
    }

    getAllServices() {
        return this.client.smembersAsync(this._allServicesKey);
    }

    addService(serviceName) {
        return this.client.saddAsync(this._allServicesKey, serviceName);
    }

    removeService(serviceName) {
        return this.client.sremAsync(this._allServicesKey, serviceName);
    }

    _getApplicationKey(appName) {
        return `app.${appName.toLowerCase()}.service`;
    }
}

module.exports = BaseRepository;
