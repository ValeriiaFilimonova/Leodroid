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

    getAllCommands() {
        const key = `${this._servicePrefix}*${this._commandsPostfix}`;
        let serviceNames;

        return this.client.keysAsync(key)
            .then((keys) => {
                serviceNames = _.map(keys, (commandsKey) => {
                    return _.last(commandsKey.split('.', 2));
                });
                return bluebird.map(keys, (key) => this.client.getAsync(key));
            })
            .then((results) => {
                return _.zipObject(serviceNames, results.map(JSON.parse));
            });

    }

    getServiceByName(serviceName) {
        const key = this._getServiceKey(serviceName);

        return this.client.hgetallAsync(key + this._infoPostfix)
            .then((info) => {
                if (_.isNull(info)) {
                    throw new errors.NotFoundError(serviceName);
                }

                const commands = info.commands && JSON.parse(info.commands);
                return {
                    applicationName: info.applicationName,
                    description: info.description,
                    serviceName: info.serviceName,
                    commands: commands,
                };
            });
    }

    addOrUpdateService(serviceName, serviceModel) {
        const key = this._getServiceKey(serviceName);
        const commands = this._getCommandsPresentation(serviceModel);

        const service = _({ serviceName })
            .defaults(serviceModel)
            .assign({ commands })
            .omitBy(_.isUndefined)
            .value();

        const queries = [
            this.client.delAsync(key + this._infoPostfix),
            this.client.hmsetAsync(key + this._infoPostfix, service),
            this.client.setAsync(this._getApplicationKey(serviceModel.applicationName), serviceName),
        ];

        if (commands) {
            queries.push(this.client.setAsync(key + this._commandsPostfix, this._getCommandsString(serviceModel)));
        }

        return super.addService(serviceName)
            .then(() => bluebird.all(queries))
            .then(() => service);
    }

    removeService(serviceName) {
        const key = this._getServiceKey(serviceName);
        let serviceModel;

        return this.client.hgetallAsync(key + this._infoPostfix)
            .then((serviceInfo) => {
                if (!serviceInfo) {
                    throw new errors.NotFoundError(serviceName);
                }

                serviceModel = serviceInfo;
                return super.removeService(serviceName);
            })
            .then(() => this.client.delAsync(
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

    _getCommandsPresentation(serviceModel) {
        const fullCommands = _.get(serviceModel, 'commands.rules');

        if (_.isEmpty(fullCommands)) {
            return undefined;
        }

        const shortCommands = _.reduce(fullCommands, (result, command) => {
            const shortCommand = { [command.rule]: command.description };
            return _.extend(result, shortCommand);
        }, {});

        return JSON.stringify(shortCommands);
    }

    _getCommandsString(serviceModel) {
        return JSON.stringify(serviceModel.commands);
    }
}

module.exports = new CommonServiceRepository();
