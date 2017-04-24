'use strict';

const _ = require('lodash');
const fs = require('fs');
const config = require('../config');
const Service = require('../common/Service');

class UnitFileManager {
    get template() {
        return _.template(
            '[Unit]\n' +
            'Description=<%= description %>\n' +
            'OnFailure=failure-monitoring.service\n' +
            '[Service]\n' +
            'Type=simple\n' +
            'ExecStart=<%= startCommand %>\n' +
            'ExecStopPost=/bin/bash <%= applicationsPath %>/OnStopScript.sh %p\n' +
            'ExecStartPost=/bin/bash <%= applicationsPath %>/OnStartScript.sh %p\n'
        );
    }

    _getFileData(service) {
        return this.template({
            description: service.description || service.applicationName,
            startCommand: service.executionCommand,
            applicationsPath: config.path.dir.services,
        });
    }

    createUnitFile(service) {
        const fileName = `${config.path.dir.temporary}/${service.serviceName}.service`;
        return fs.writeFileSync(fileName, this._getFileData(service));
    }
}

module.exports = new UnitFileManager();
