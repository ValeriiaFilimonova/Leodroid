'use strict';

const bluebird = require('bluebird');
const childProcess = require('child_process');

class FileSystemManager {
    constructor() {
        this.exec = bluebird.promisify(childProcess.exec);
    }

    createTempDirectoryWithDictionary() {
        return this.exec(`mkdir -p ${this.tempDir}`)
            .then(() => this.exec(`cp ${this.modelsDir}/${this.dictionaryFile} ${this.tempDir}`));
    }

    removeTempDirectory() {
        return this.exec(`rm -rf ${this.tempDir}`);
    }

    copyDictionaryAndGrammar() {
        return this.exec(`cp -f ${this.tempDir}/${this.dictionaryFile} ${this.modelsDir}/${this.dictionaryFile}`)
            .then(() => this.exec(`cp ${this.tempDir}/${this.grammarFile} ${this.modelsDir}/${this.grammarFile}`))
    }

    copyFiles(service) {
        return this.copyDictionaryAndGrammar()
            .then(() => this.exec(`cp ${this.tempDir}/${service.serviceName}.service ${this.systemdDir}`))
            .then(() => this.exec(`cp ${this.tempDir}/${service.executable} ${this.servicesDir}`))
            .then(() => this.exec(`cp -rf ${this.tempDir}/dependencies ${this.librariesDir}/${service.directoryName}`));
    }

    removeFiles(service) {
        return this.copyDictionaryAndGrammar()
            .then(() => this.exec(`rm -f ${this.systemdDir}/${service.serviceName}.service`))
            .then(() => this.exec(`rm -f ${this.servicesDir}/${service.executable}`))
            .then(() => this.exec(`rm -rf ${this.librariesDir}/${service.directoryName}`));
    }

    get tempDir() {
        // return '/usr/share/droid-system/temp';
        return '/home/valera/Documents/IdeaProjects/DroidSystem/MaintenanceService/temp';
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
        // return FileSystemManager.servicesDir + '/models/en';
        return '/home/valera/Documents/IdeaProjects/DroidSystem/SpeechRecognitionService/src/models/en';
    }

    get dictionaryFile() {
        return 'dictionary.dict';
    }

    get grammarFile() {
        return 'grammar.gram';
    }
}

const FSM = FileSystemManager;

module.exports = new FileSystemManager();
