'use strict';

const _ = require('lodash');
const errors = require('./../Errors');
const redis = require('./../RedisClient');

class CommonServiceRepository {
    constructor() {
        this._prefix = "service.";
        this._commandsPostfix = '.commands'
    }

    _getCommonKey(serviceName) {
        if (!/^[a-zA-Z0-9-_]*$/.test(serviceName)) {
            throw new errors.ValidationError('Service name shouldn\'t contain any special symbols including spaces');
        }

        return this._prefix + serviceName;
    }

    _getDependencies(dependencies) {
        if (dependencies) {
            return _.flatten([dependencies]).toString();
        }
    }

    _getCommands(commands) {
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

    addNewService(serviceName, serviceModel) {
        const key = this._getCommonKey(serviceName);

        const dependencies = this._getDependencies(serviceModel.dependencies);
        const commands = this._getCommands(serviceModel.commands);

        const service = _(serviceModel)
            .assign({ dependencies, commands })
            .omitBy(_.isUndefined)
            .omit('commands')
            .value();

        return Promise.all([
            redis.hmset(key, service),
            redis.hmset(key + this._commandsPostfix, serviceModel.commands),
        ]);
    }
}

module.exports = new CommonServiceRepository();
