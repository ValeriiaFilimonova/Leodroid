'use strict';

const request = require('superagent');
const errors = require('../Errors');

class DataStorageClient {
    constructor() {
        this._host = 'http://localhost:8888';
        this._path = '/storage/services/';
    }

    getService(serviceName) {
        return request
            .get(this._host + this._path + serviceName)
            .set('Accept', 'application/json')
            .then((res, err) => {
                if (err) {
                    throw new errors.ServiceAddingError(`Error getting service info`, err);
                }
                return res.body;
            });
    }

    addNewService(service) {
        return request
            .put(this._host + this._path + service.serviceName)
            .set('Accept', 'application/json')
            .send(service.toStorageModel());
    }

    removeService() {
    }
}

module.exports = new DataStorageClient();
