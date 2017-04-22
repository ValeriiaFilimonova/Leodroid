'use strict';

const _ = require('lodash');
const shortId = require('shortid');
const errors = require('../Errors');

class Service {
    constructor(data) {
        this._validate(['applicationName', 'executable', 'commands'], data);

        this._dependenciesPath = '/usr/lib/droid-system';

        this._identifier = data.identifier || shortId.generate();
        this._applicationName = data.applicationName;
        this._serviceName = data.serviceName || _.kebabCase(this._applicationName);
        this._description = data.description;
        this._executable = data.executable;
        this._commands = _.assign(data.commands, { serviceId: this._identifier });
    }

    _validate(requiredProperties, data) {
        _(requiredProperties).forEach((propertyName) => {
            if (_.isEmpty(data[propertyName])) {
                throw new errors.ValidationError(`'${propertyName}' property required`);
            }
        });
    }

    get identifier() {
        return this._identifier;
    }

    get applicationName() {
        return this._applicationName;
    }

    get serviceName() {
        return this._serviceName;
    }

    get directoryName() {
        return _.upperFirst(_.camelCase(this.applicationName));
    }

    get executable() {
        return this._executable;
    }

    get description() {
        return this._description;
    }

    get commands() {
        return this._commands;
    }

    get executionCommand() {
        return `${Service.applicationsPath}/${this.directoryName}`;
    }

    toStorageModel() {
        return {
            identifier: this.identifier,
            applicationName: this.applicationName,
            description: this.description,
            commands: this.commands,
        };
    }

    static get applicationsPath() {
        return '/usr/share/droid-system';
    }
}

module.exports = Service;
