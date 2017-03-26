'use strict';

const _ = require('lodash');
const bluebird = require('bluebird');
const errors = require('./../Errors');

const BaseRepository = require('../base/BaseRepository');

class ServiceStatusRepository extends BaseRepository {
    constructor() {
        super();

        this._statuses = _.values(ServiceStatusRepository.STATUS);

        this._statusPostfix = 'status.';
        this._runningStatusKey = this._servicePrefix + this._statusPostfix + ServiceStatusRepository.STATUS.RUNNING;
        this._failedStatusKey = this._servicePrefix + this._statusPostfix + ServiceStatusRepository.STATUS.FAILED;
    }

    getStatuses() {
        return bluebird.all([
            this._redis.sinterAsync(this._allServicesKey, this._runningStatusKey),
            this._redis.sinterAsync(this._allServicesKey, this._failedStatusKey),
            this._redis.sdiffAsync(this._allServicesKey, this._runningStatusKey, this._failedStatusKey),
        ]).then((results) => {
            const statuses = {};

            _(results[0]).forEach((serviceName) => statuses[serviceName] = ServiceStatusRepository.STATUS.RUNNING);
            _(results[1]).forEach((serviceName) => statuses[serviceName] = ServiceStatusRepository.STATUS.FAILED);
            _(results[2]).forEach((serviceName) => statuses[serviceName] = ServiceStatusRepository.STATUS.STOPPED);

            return statuses;
        })
    }

    updateStatuses(data) {
        return this._validate(data).then(() => {
            const promises = [];
            _(data).forEach((status, serviceName) => {
                switch (status) {
                    case ServiceStatusRepository.STATUS.RUNNING:
                        promises.push(this._redis.saddAsync(this._runningStatusKey, serviceName));
                        promises.push(this._redis.sremAsync(this._failedStatusKey, serviceName));
                        break;
                    case ServiceStatusRepository.STATUS.STOPPED:
                        promises.push(this._redis.sremAsync(this._runningStatusKey, serviceName));
                        break;
                    case ServiceStatusRepository.STATUS.FAILED:
                        promises.push(this._redis.sremAsync(this._runningStatusKey, serviceName));
                        promises.push(this._redis.saddAsync(this._failedStatusKey, serviceName));
                        break;
                }
            });

            return bluebird.all(promises);
        });
    }

    _validate(data) {
        if (!_.isObject(data) || _.isEmpty(data)) {
            throw new errors.ValidationError('Statuses must be non-empty object');
        }

        return super.getAllServices().then((serviceNames) => {
            _(data).forOwn((value, key) => {
                if (!_.isString(value)) {
                    throw new errors.ValidationError('Statuses must be string key-value pair');
                }
                if (!_.includes(this._statuses, value)) {
                    throw new errors.ValidationError(`Status must be one of the ${this._statuses}`)
                }
                if (!_.includes(serviceNames, key)) {
                    throw new errors.NotFoundError(`${key} service doesn't exist`);
                }
            });
        });
    }

    static get STATUS() {
        return {
            RUNNING: 'running',
            FAILED: 'failed',
            STOPPED: 'stopped',
        }
    }
}

module.exports = new ServiceStatusRepository();
