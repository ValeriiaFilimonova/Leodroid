'use strict';

const _ = require('lodash');
const DictionaryManager = require('./DictionaryManager');
const GrammarManager = require('./GrammarManager');
const DataStorageClient = require('../helpers/DataStorageClient');
const FileManager = require('../helpers/FileSystemManager');

const errors = require('../Errors');

class SphinxConfigurator {
    constructor() {
        this._dictionaryManager = new DictionaryManager(`${FileManager.tempDir}/${FileManager.dictionaryFile}`, FileManager.fullDictionaryPath);
        this._grammarManager = new GrammarManager(`${FileManager.tempDir}/${FileManager.grammarFile}`);
    }

    addCommands(service) {
        let existingCommands, newCommands;

        return DataStorageClient.getCommands()
            .then((response) => {
                existingCommands = response.body;
                newCommands = { [service.serviceName]: service.commands };
            })
            .then(() => this._dictionaryManager.addToDictionary(existingCommands, newCommands, service.serviceName))
            .then(() => this._grammarManager.generateGrammar(_.assign(existingCommands, newCommands)))
            .catch((err) => {
                throw new errors.ServiceMaintenanceError('Failed to configure commands for recognition service', err);
            });
    }

    removeCommands(service) {
        let allCommands, obsoleteCommands;

        return DataStorageClient.getCommands()
            .then((response) => {
                allCommands = response.body;
                obsoleteCommands = { [service.serviceName]: allCommands[service.serviceName] };
            })
            .then(() => this._dictionaryManager.removeFromDictionary(allCommands, obsoleteCommands))
            .then(() => this._grammarManager.generateGrammar(_.omit(allCommands, service.serviceName)))
            .catch((err) => {
                throw new errors.ServiceMaintenanceError('Failed to re-configure recognition service', err);
            });
    }
}

module.exports = new SphinxConfigurator();
