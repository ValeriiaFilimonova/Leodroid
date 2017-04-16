'use strict';

const _ = require('lodash');
const bluebird = require('bluebird');
const childProcess = require('child_process');

class DictionaryManager {
    constructor(modelsPath) {
        this._dictionaryPath = modelsPath + "dictionary.dict";
        this._fullDictionaryPath = modelsPath + "full_dictionary.dict";

        this.excludedServiceName = "application-managing";
        this.exec = bluebird.promisify(childProcess.exec);
    }

    _getParamsWords(params) {
        return _(params).values()
            .flatten()
            .map(_.lowerCase)
            .value();
    }

    _getRulesWords(rules, params) {
        return _(rules).values()
            .map((value) => {
                return _.reduce(params, (rule, param) => _.replace(rule, `<${param}>`, ''), value.rule).toLowerCase();
            })
            .value();
    }

    _getApplicationNameWords(name) {
        return name !== this.excludedServiceName ? _.words(name) : null;
    }

    _getUniqueWordsFrom(commands) {
        const phrases = _(commands)
            .map((command, serviceName) => {
                const serviceParams = this._getParamsWords(command.params);
                const serviceRules = this._getRulesWords(command.rules, _.keys(command.params));
                const applicationName = this._getApplicationNameWords(serviceName);
                return _.concat(serviceParams, serviceRules, applicationName);
            })
            .flatten()
            .value();

        return _(phrases)
            .map(_.words)
            .flatten()
            .uniq()
            .value();
    }

    addToDictionary(existingCommands, newCommands) {
        const existingWords = this._getUniqueWordsFrom(existingCommands);
        const newWords = this._getUniqueWordsFrom(newCommands);
        const wordsToAdd = _.difference(newWords, existingWords);

        return bluebird
            .map(wordsToAdd, (word) => {
                return this.exec(`cat ${this._fullDictionaryPath} | grep -e '^${word}[ |(]' >> ${this._dictionaryPath}`);
            });
    }
}

module.exports = DictionaryManager;
