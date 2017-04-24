'use strict';

const bluebird = require('bluebird');
const childProcess = require('child_process');

const errors = require('../Errors');

class SystemctlExecutor {
    constructor() {
        this.exec = bluebird.promisify(childProcess.exec);
    }

    _reloadDaemon() {
        return this.exec('sudo systemctl daemon-reload')
            .then((response) => {
                if (response) {
                    throw new errors.ServiceMaintenanceError('Failed to enable new application', new Error(response));
                }
            })
    }

    _restartRecognitionService() {
        return this.exec('sudo systemctl restart speech-recognition')
            .then((response) => {
                if (response) {
                    throw new errors.ServiceMaintenanceError('Failed to restart recognition service', new Error(response));
                }
            });
    }

    applyChanges() {
        return this._reloadDaemon().then(() => this._restartRecognitionService());
    }
}

module.exports = new SystemctlExecutor();
