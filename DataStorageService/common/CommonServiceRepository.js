'use strict';

const _ = require('lodash');
const bluebird = require('bluebird');
const errors = require('./../Errors');
const redis = require('./../RedisClient');

class CommonServiceRepository {
    constructor() {
        this._servicePrefix = "service.";
        this._infoPostfix = '.info';
        this._commandsPostfix = '.commands';
    }

    getAllServices() {
        let services;
        let infoPromises, commandsPromises;

        return bluebird
            .all([
                redis.keysAsync(`${this._servicePrefix}*${this._infoPostfix}`),
                redis.keysAsync(`${this._servicePrefix}*${this._commandsPostfix}`),
            ])
            .then((keys) => {
                infoPromises = _.map(keys[0], (key) => redis.hgetallAsync(key));
                commandsPromises = _.map(keys[1], (key) => redis.hgetallAsync(key));
                return bluebird.all(infoPromises);
            })
            .then((mainInfo) => {
                services = _.map(mainInfo, (service) => {
                    return _.assign(service, { dependencies: this._getDependenciesArray(service.dependencies) })
                });
                return bluebird.all(commandsPromises);
            })
            .then((commandsInfo) => {
                return _.map(commandsInfo, (commands, index) => {
                    return _.assign(services[index], { commands });
                });
            });
    }

    getServiceByName(serviceName) {
        const key = this._getCommonKey(serviceName);

        return bluebird
            .all([
                redis.hgetallAsync(key + this._infoPostfix),
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
            });
    }

    addOrUpdateService(serviceName, serviceModel) {
        const key = this._getCommonKey(serviceName);

        const dependencies = this._validateDependencies(serviceModel.dependencies);
        const commands = this._validateCommands(serviceModel.commands);

        const service = _({ serviceName })
            .defaults(serviceModel)
            .assign({ dependencies, commands })
            .omitBy(_.isUndefined)
            .value();

        return bluebird
            .all([
                redis.hmsetAsync(key + this._infoPostfix, _.omit(service, 'commands')),
                redis.hmsetAsync(key + this._commandsPostfix, serviceModel.commands),
            ])
            .then(() => service);
    }

    removeService(serviceName) {
        const key = this._getCommonKey(serviceName);

        return bluebird.all([
            redis.del(key + this._infoPostfix, key + this._commandsPostfix),
        ]);
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
