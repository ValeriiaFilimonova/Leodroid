'use strict';

const bluebird = require('bluebird');
const childProcess = require('child_process');

class FileSystemManager {
    constructor() {
        this.exec = bluebird.promisify(childProcess.exec);
    }

    prepareTempDirectory() {
        return this.exec(`mkdir -p ${this.tempDir}`)
            .then(() => this.exec(`cp ${this.modelsDir}/${this.dictionaryFile} ${this.tempDir}`));
    }

    removeTempDirectory() {
        return this.exec(`rm -rf ${this.tempDir}`);
    }

    removeTempDirectorySync() {
        return childProcess.execSync(`rm -rf ${this.tempDir}`);
    }

    copyFiles(service) {
        return this._copyDictionaryAndGrammar()
            // copy unit file
            .then(() => this.exec(`cp ${this.tempDir}/${service.serviceName}.service ${this.systemdDir}`))
            // copy executable file
            .then(() => this.exec(`cp ${this.tempDir}/${service.executable} ${this.servicesDir}`))
            // copy folder with libraries (for java service)
            .then(() => {
                if (service.dependencies) {
                    return bluebird.all([
                        this.exec(`mkdir -p ${this.librariesDir}/${service.directoryName}`),
                        this.exec(`cp ${this.tempDir}/dependencies/* ${this.librariesDir}/${service.directoryName}`),
                    ]);
                }
            });
    }

    removeFiles(service) {
        return this._copyDictionaryAndGrammar()
            // remove unit file
            .then(() => this.exec(`rm -f ${this.systemdDir}/${service.serviceName}.service`))
            // remove executable file
            .then(() => this.exec(`rm -f ${this.servicesDir}/${service.executable}`))
            // remove folder with libraries (for java service)
            .then(() => this.exec(`rm -rf ${this.librariesDir}/${service.directoryName}`));
    }

    _copyDictionaryAndGrammar() {
        return this.exec(`cp -f ${this.tempDir}/${this.dictionaryFile} ${this.modelsDir}/${this.dictionaryFile}`)
            .then(() => this.exec(`cp ${this.tempDir}/${this.grammarFile} ${this.modelsDir}/${this.grammarFile}`))
    }

    get tempDir() {
        return process.env.TEMP_DIRECTORY || '/usr/share/droid-system/temp';
    }

    get configFile() {
        return this.tempDir + '/config.json';
    }

    get systemdDir() {
        return '/etc/systemd/system';
    }

    get librariesDir() {
        return '/usr/lib/droid-system';
    }

    get servicesDir() {
        return '/usr/share/droid-system';
    }

    get modelsDir() {
        return process.env.MODELS_DIRECTORY || (this.servicesDir + '/models/en');
    }

    get fullDictionaryPath() {
        return this.modelsDir + '/dictionary.dict.full';
    }

    get dictionaryFile() {
        return 'dictionary.dict';
    }

    get grammarFile() {
        return 'grammar.gram';
    }
}

module.exports = new FileSystemManager();
