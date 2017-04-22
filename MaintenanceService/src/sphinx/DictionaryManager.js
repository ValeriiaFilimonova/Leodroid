'use strict';

const _ = require('lodash');
const bluebird = require('bluebird');
const childProcess = require('child_process');

const errors = require('../Errors');

class DictionaryManager {
    constructor(path) {
        this._dictionaryPath = path;
        this._fullDictionaryPath = path + '.full';

        this.excludedServiceNames = ["application-managing"];
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
        return !_.includes(this.excludedServiceNames, name) ? _.words(name) : null;
    }

    _getPhrasesFrom(commands) {
        return _(commands)
            .map((command, serviceName) => {
                const serviceParams = this._getParamsWords(command.params);
                const serviceRules = this._getRulesWords(command.rules, _.keys(command.params));
                const applicationName = this._getApplicationNameWords(serviceName);
                return _.concat(serviceParams, serviceRules, applicationName);
            })
            .flatten()
            .value();
    }

    _getWordsFrom(commands) {
        return _(this._getPhrasesFrom(commands))
            .map(_.words)
            .flatten()
            .value();
    }

    _getWordsUsageTree(commands) {
        const usage = {};
        const words = this._getWordsFrom(commands);
        words.forEach((word) => {
            if (!usage[word]) {
                usage[word] = 1;
            } else {
                usage[word]++;
            }
        });
        return usage;
    }

    addToDictionary(existingCommands, newCommands, serviceName) {
        const existingWords = this._getWordsFrom(existingCommands);
        const newWords = this._getWordsFrom(newCommands);
        const wordsToFind = _.difference(newWords, existingWords);

        const customEntries = _(newCommands[serviceName].dictionary)
            .map((value, word) => {
                _.pull(wordsToFind, word);
                return word + ' ' + value;
            })
            .value();

        return bluebird
            .map(wordsToFind, (word) => {
                return this.exec(`cat ${this._fullDictionaryPath} | grep -e '^${word}[ |(]'`)
                    .catch((err) => {
                        if (err instanceof bluebird.OperationalError) {
                            throw new errors.ValidationError(`There is no '${word}' word in the dictionary`);
                        }
                        throw err;
                    });
            })
            .then((results) => {
                const lineToInsert = _.join(results, '') + _.join(customEntries, '\n');
                return this.exec(`echo "${_.trimEnd(lineToInsert, '\n')}" >> ${this._dictionaryPath}`);
            });
    }

    removeFromDictionary(allCommands, obsoleteCommands) {
        const wordsUsage = this._getWordsUsageTree(allCommands);
        const obsoleteWords = this._getWordsUsageTree(obsoleteCommands);
        const wordsToRemove = _(obsoleteWords)
            .omitBy((count, word) => wordsUsage[word] !== count)
            .keys()
            .value();

        const regexp = _.join(wordsToRemove, '.*\\|');
        return this.exec(`sed -i -e '/${regexp}/ d' ${this._dictionaryPath}`);
    }
}

module.exports = DictionaryManager;
