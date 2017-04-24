'use strict';

const _ = require('lodash');
const config = require('../config');
const errors = require('../Errors');
const DictionaryManager = require('./DictionaryManager');
const GrammarManager = require('./GrammarManager');
const DataStorageClient = require('../helpers/DataStorageClient');

class SphinxConfigurator {
    constructor() {
        this._dictionaryManager = new DictionaryManager(
            `${config.path.dir.temporary}/${config.path.file.dictionary}`,
            `${config.path.dir.models}/${config.path.file.fullDictionary}`);
        this._grammarManager = new GrammarManager(`${config.path.dir.temporary}/${config.path.file.grammar}`);
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
