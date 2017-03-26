'use strict';

const _ = require('lodash');
const bluebird = require('bluebird');
const errors = require('./../Errors');
const redis = require('./../RedisClient');

class CommonServiceRepository {
    constructor() {
        this._servicePrefix = "service.";
        this._commandsPostfix = '.commands'
    }

    getServiceByName(serviceName) {
        const key = this._getCommonKey(serviceName);

        return bluebird
            .all([
                redis.hgetallAsync(key),
                redis.hgetallAsync(key + this._commandsPostfix),
            ])
            .then((result) => {
                const info = result[0];
                const commands = result[1];

                if (_.isNull(info)) {
                    throw new errors.NotFoundError(`Service '${serviceName}' doesn't exist`);
                }

                return _(info)
                    .assign({
                        commands: commands,
                        dependencies: this._getDependenciesArray(info.dependencies),
                    })
                    .omitBy(_.isUndefined)
                    .value();
            })
            .then((serviceModel) => this._appendServiceName(serviceName, serviceModel));
    }

    addOrUpdateService(serviceName, serviceModel) {
        const key = this._getCommonKey(serviceName);

        const dependencies = this._validateDependencies(serviceModel.dependencies);
        const commands = this._validateCommands(serviceModel.commands);

        const service = _(serviceModel)
            .assign({ dependencies, commands })
            .omitBy(_.isUndefined)
            .omit('commands')
            .value();

        return bluebird
            .all([
                redis.hmset(key, service),
                redis.hmset(key + this._commandsPostfix, serviceModel.commands),
            ])
            .then(() => this._appendServiceName(serviceName, serviceModel));
    }

    removeService(serviceName) {
        const key = this._getCommonKey(serviceName);

        return bluebird.all([
            redis.del(key, key + this._commandsPostfix),
        ]);
    }

    _appendServiceName(serviceName, response) {
        return _.defaults({ serviceName }, response);
    }

    _getCommonKey(serviceName) {
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
        if (!commands) {
            return;
        }
        if (!_.isObject(commands)) {
            throw new errors.ValidationError('Commands must be an object');
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
