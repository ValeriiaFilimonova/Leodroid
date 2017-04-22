'use strict';

const _ = require('lodash');
const errors = require('../Errors');
const DictionaryManager = require('./DictionaryManager');
const GrammarManager = require('./GrammarManager');
const DataStorageClient = require('../helpers/DataStorageClient');

class SphinxConfigurator {
    constructor(dictionaryPath, grammarPath) {
        if (_.isEmpty(dictionaryPath) || _.isEmpty(grammarPath)) {
            throw  new errors.ValidationError('SphinxConfigurator needs dictionary and grammar paths specified');
        }

        this._dictionaryManager = new DictionaryManager(dictionaryPath);
        this._grammarManager = new GrammarManager(grammarPath);
    }

    addCommands(service) {
        let existingCommands, newCommands;

        return DataStorageClient.getCommands()
            .then((response) => {
                existingCommands = response.body;
                newCommands = { [service.serviceName]: service.commands };
            })
            .then(() => this._dictionaryManager.addToDictionary(existingCommands, newCommands, service.serviceName))
            .then(() => this._grammarManager.generateGrammar(_.assign(existingCommands, newCommands)));
            // reload service
    }

    removeCommands(service) {
        let allCommands, obsoleteCommands;

        return DataStorageClient.getCommands()
            .then((response) => {
                allCommands = response.body;
                obsoleteCommands = { [service.serviceName]: allCommands[service.serviceName] };
            })
            .then(() => this._dictionaryManager.removeFromDictionary(allCommands, obsoleteCommands))
            .then(() => this._grammarManager.generateGrammar(_.omit(allCommands, service.serviceName)));
            // reload service
    }
}

module.exports = new SphinxConfigurator();
