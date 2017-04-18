'use strict';

const _ = require('lodash');
const DictionaryManager = require('./DictionaryManager');
const GrammarManager = require('./GrammarManager');
const DataStorageClient = require('../helpers/DataStorageClient');

class SphinxConfigurator {
    constructor() {
        // this._modelsPath = "/usr/share/droid-system/models/en/";
        this._modelsPath = '/home/valera/Documents/IdeaProjects/DroidSystem/SpeechRecognitionService/src/models/en/';
        this._dictionaryManager = new DictionaryManager(this._modelsPath);
        this._grammarManager = new GrammarManager(this._modelsPath);
    }

    addCommands(service) {
        let existingCommands, newCommands;

        return DataStorageClient.getCommands()
            .then((response) => {
                existingCommands = response.body;
                newCommands = { [service.serviceName]: service.commands };
            })
            .then(() => this._dictionaryManager.addToDictionary(existingCommands, newCommands))
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
