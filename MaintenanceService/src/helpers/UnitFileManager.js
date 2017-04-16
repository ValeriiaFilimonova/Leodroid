'use strict';

const _ = require('lodash');
const fs = require('fs');
const bluebird = require('bluebird');
const Service = require('../common/Service');

class UnitFileService {
    constructor(service) {
        // this._systemdPath = '/etc/systemd/system';
        this._systemdPath = '/home/valera/Documents/IdeaProjects/DroidSystem/MaintenanceService/';
        this._service = service;

        this._writeFile = bluebird.promisify(fs.writeFile);
        this._deleteFile = bluebird.promisify(fs.unlink);
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
        return this._writeFile(this.fileName, this.unitFile);
    }

    removeUnitFile() {
        return this._deleteFile(this.fileName);
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

module.exports = UnitFileService;
