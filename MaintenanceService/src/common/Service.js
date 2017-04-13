'use strict';

const _ = require('lodash');
const errors = require('../Errors');

class Service {
    constructor(data) {
        this._validate(['applicationName', 'commands'], data);
        this._validateCommands(data.commands);

        this._applicationName = data.applicationName;
        this._description = data.description;
        this._commands = data.commands;
    }

    _validate(requiredProperties, data) {
        _(requiredProperties).forEach((propertyName) => {
            if (_.isEmpty(data[propertyName])) {
                throw new errors.ValidationError(`'${propertyName}' property required`);
            }
        });
    }

    _validateCommands(commands) {
        if (!_.isArray(commands) || _.some(commands, _.negate(_.isString))) {
            throw new errors.ValidationError('Commands must be an array of strings');
        }
    }

    get applicationName() {
        return this._applicationName;
    }

    get serviceName() {
        return _.kebabCase(this.applicationName);
    }

    get directoryName() {
        return _.upperFirst(_.camelCase(this.applicationName));
    }

    get description() {
        return this._description;
    }

    get commands() {
        return this._commands;
    }

    get executionCommand() {
        return `:${Service.applicationsPath}/${this.directoryName}`;
    }

    static get applicationsPath() {
        return '/usr/share/droid-system';
    }
}

module.exports = Service;
