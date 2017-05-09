'use strict';

const bluebird = require('bluebird');
const childProcess = require('child_process');
const config = require('../config');

class FileSystemManager {
    constructor() {
        this.exec = bluebird.promisify(childProcess.exec);
    }

    prepareTempDirectory() {
        return this.exec(`mkdir -p ${this.tempDir}`)
            .then(() => this.exec(`cp ${this.modelsDir}/${this.dictionaryFile} ${this.tempDir}`))
    }

    removeTempDirectory() {
        return this.exec(`rm -rf ${this.tempDir}`);
    }

    removeTempDirectorySync() {
        return childProcess.execSync(`rm -rf ${this.tempDir}`);
    }

    copyFiles(service) {
        return this._moveDictionaryAndGrammar()
            .then(() => this.exec(`mv ${this.tempDir}/${service.serviceName}.service ${this.systemdDir}`)) // copy unit file
            .then(() => {
                return bluebird.all([
                    this.exec(`mkdir -p ${this.servicesDir}/${service.directoryName}`),
                    this.exec(`cp -r ${this.tempDir}/* ${this.servicesDir}/${service.directoryName}/`), // copy source files
                ]);
            });
    }

    removeFiles(service) {
        return this._moveDictionaryAndGrammar()
            .then(() => this.exec(`rm -f ${this.systemdDir}/${service.serviceName}.service`)) // remove unit file
            .then(() => this.exec(`rm -r ${this.servicesDir}/${service.directoryName}`)); // remove source files
    }

    _moveDictionaryAndGrammar() {
        return this.exec(`mv ${this.tempDir}/${this.dictionaryFile} ${this.modelsDir}/${this.dictionaryFile}`)
            .then(() => this.exec(`mv ${this.tempDir}/${this.grammarFile} ${this.modelsDir}/${this.grammarFile}`))
    }

    get tempDir() {
        return config.path.dir.temporary;
    }

    get systemdDir() {
        return config.path.dir.systemd;
    }

    get libsDir() {
        return config.path.dir.libraries;
    }

    get servicesDir() {
        return config.path.dir.services;
    }

    get modelsDir() {
        return config.path.dir.models;
    }

    get dictionaryFile() {
        return config.path.file.dictionary;
    }

    get grammarFile() {
        return config.path.file.grammar;
    }
}

module.exports = new FileSystemManager();
