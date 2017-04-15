'use strict';

const _ = require('lodash');
const fs = require('fs');
const bluebird = require('bluebird');
const errors = require('../Errors');
const Service = require('../common/Service');

class UnitFileService {
    constructor(service) {
        this._systemdPath = '/etc/systemd/system';
        this._service = service;

        this._writeFile = bluebird.promisify(fs.writeFile);
        this._deleteFile = bluebird.promisify(fs.unlink);
        this._readFile = bluebird.promisify(fs.readFile);
    }

    get fileName() {
        return `${this._systemdPath}/${this._service.serviceName}.service`;
    }

    get unitFile() {
        return UnitFileService.template({
            description: this._service.description || this._service.applicationName,
            startCommand: this._service.executionCommand,
            applicationsPath: Service.applicationsPath,
        });
    }

    createUnitFile() {
        return this._writeFile(this.fileName, this.unitFile)
            .catch((err) => {
                throw new errors.ServiceAddingError('Failed to write unit file', err);
            });
    }

    removeUnitFile() {
        return this._deleteFile(this.fileName)
            .catch((err) => {
                throw new errors.ServiceRemovingError('Failed to remove unit file', err);
            });
    }

    //TODO remove after service is ready
    readUnitFile() {
        return this._readFile(this.fileName, 'utf8')
            .then((contents) => console.log(contents));
    }

    static get template() {
        return _.template(
            '[Unit]\n' +
            'Description=<%= description %>\n' +
            'Requires=droid-builtin.target\n' +
            '[Service]\n' +
            'Type=simple\n' +
            'Restart=on-failure\n' +
            'ExecStart=<%= startCommand %>\n' +
            'ExecStopPost=/bin/bash <%= applicationsPath %>/OnStopScript.sh %p\n'
        );
    }
}

module.exports = UnitFileService;