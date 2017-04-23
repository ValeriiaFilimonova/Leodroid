'use strict';

const _ = require('lodash');

class ServiceDataModel {
    constructor(data) {
        this._identifier = data.identifier;
        this._applicationName = data.applicationName;
        this._serviceName = data.serviceName;
        this._commands = data.commands;
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

    get commands() {
        return this._commands;
    }
}

module.exports = ServiceDataModel;
