'use strict';

const _ = require('lodash');
const bluebird = require('bluebird');
const errors = require('./../Errors');

const BaseRepository = require('../base/BaseRepository');

class CommonServiceRepository extends BaseRepository {
    constructor() {
        super();
        this._infoPostfix = '.info';
        this._commandsPostfix = '.commands';
    }

    getAllServices() {
        return super.getAllServices().then((services) => {
            return bluebird.map(services, (serviceName) => this.getServiceByName(serviceName));
        });
    }

    getServiceByName(serviceName) {
        const key = this._getServiceKey(serviceName);

        return bluebird
            .all([
                this._redis.hgetallAsync(key + this._infoPostfix),
                this._redis.hgetallAsync(key + this._commandsPostfix),
            ])
            .then((result) => {
                const info = result[0];
                const commands = result[1];

                if (_.isNull(info)) {
                    throw new errors.NotFoundError(serviceName);
                }

                return _(info)
                    .assign({
                        commands: commands,
                        dependencies: this._getDependenciesArray(info.dependencies),
                    })
                    .omitBy(_.isUndefined)
                    .value();
            });
    }

    addOrUpdateService(serviceName, serviceModel) {
        const key = this._getServiceKey(serviceName);

        const dependencies = this._validateDependencies(serviceModel.dependencies);
        const commands = this._validateCommands(serviceModel.commands);

        const service = _({ serviceName })
            .defaults(serviceModel)
            .assign({ dependencies, commands })
            .omitBy(_.isUndefined)
            .value();

        return super.addService(serviceName).then(() => bluebird
            .all([
                this._redis.hmsetAsync(key + this._infoPostfix, _.omit(service, 'commands')),
                this._redis.hmsetAsync(key + this._commandsPostfix, _.get(serviceModel, 'commands')),
                this._redis.setAsync(this._getApplicationKey(serviceModel.applicationName), serviceName),
            ])
            .then(() => service));
    }

    removeService(serviceName) {
        const key = this._getServiceKey(serviceName);
        let serviceModel;

        return this._redis.hgetallAsync(key + this._infoPostfix)
            .then((serviceInfo) => {
                if (!serviceInfo) {
                    throw new errors.NotFoundError(serviceName);
                }

                serviceModel = serviceInfo;
                return super.removeService(serviceName);
            })
            .then(() => this._redis.delAsync(
                key + this._infoPostfix,
                key + this._commandsPostfix,
                this._getApplicationKey(serviceModel.applicationName)
            ));
    }

    _getServiceKey(serviceName) {
        if (!/^[a-zA-Z0-9-_]*$/.test(serviceName)) {
            throw new errors.ValidationError('Service name shouldn\'t contain any special symbols including spaces');
        }

        return this._servicePrefix + serviceName;
    }

    _getDependenciesArray(dependencies) {
        return _.split(dependencies, ',');
    }

    _validateDependencies(dependencies) {
        if (dependencies) {
            return _.flatten([dependencies]).toString();
        }
    }

    _validateCommands(commands) {
        if (!_.isObject(commands) || _.isEmpty(commands)) {
            throw new errors.ValidationError('Commands must be non-empty object');
        }

        _(commands).forOwn((value, key) => {
            if (!_.isString(value)) {
                throw new errors.ValidationError('Command must be string key-value pair');
            }
        });

        return commands;
    }
}

module.exports = new CommonServiceRepository();
