'use strict';

const childProcess = require('child_process');
const config = require('../config');
const Service = require('./Service');

class NodeService extends Service {
    constructor(data) {
        super(data);
        this._nodeBinPath = '/usr/bin/node';
    }

    get executionCommand() {
        return `${this._nodeBinPath} ${this._servicesPath}/${this.directoryName}/${this.executable}`;
    }

    performPostAction() {
        return super.performPostAction()
            .then(() => childProcess.execSync(`npm i --prefix ${config.path.dir.services}/${this.directoryName}`))
            .then(() => childProcess.execSync(`npm i redis --prefix ${config.path.dir.services}/${this.directoryName}`));
    }
}

module.exports = NodeService;
