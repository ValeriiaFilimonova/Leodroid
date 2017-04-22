'use strict';

const _ = require('lodash');
const fs = require('fs');
const bluebird = require('bluebird');
const errors = require('../Errors');
const Service = require('../common/Service');

class UnitFileManager {
    constructor(service, path) {
        if (_.isEmpty(service) || _.isEmpty(path)) {
            throw  new errors.ValidationError('UnitFileManager needs path and service instance specified');
        }

        this._path = path;
        this._service = service;

        this._writeFile = bluebird.promisify(fs.writeFile);
    }

    get fileName() {
        return `${this._path}/${this._service.serviceName}.service`;
    }

    get unitFile() {
        return UnitFileManager.template({
            description: this._service.description || this._service.applicationName,
            startCommand: this._service.executionCommand,
            applicationsPath: Service.applicationsPath,
        });
    }

    createUnitFile() {
        return this._writeFile(this.fileName, this.unitFile);
    }

    static get template() {
        return _.template(
            '[Unit]\n' +
            'Description=<%= description %>\n' +
            'Requires=droid-builtin.target\n' +
            'OnFailure=failure-monitoring.service\n' +
            '[Service]\n' +
            'Type=simple\n' +
            'Restart=on-failure\n' +
            'ExecStart=<%= startCommand %>\n' +
            'ExecStopPost=/bin/bash <%= applicationsPath %>/OnStopScript.sh %p\n' +
            'ExecStartPost=/bin/bash <%= applicationsPath %>/OnStartScript.sh %p\n'
        );
    }
}

module.exports = UnitFileManager;
