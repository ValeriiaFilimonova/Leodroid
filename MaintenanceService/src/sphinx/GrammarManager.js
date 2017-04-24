'use strict';

const _ = require('lodash');
const fs = require('fs');
const bluebird = require('bluebird');
const jspeech = require('jspeech').default;

const errors = require('../Errors');

class GrammarManager {
    constructor(path) {
        this._grammarPath = path;
        this._excludedAppNames = ["application-managing"];
        this._writeFile = bluebird.promisify(fs.writeFile);
    }

    generateGrammar(commands) {
        this._grammar = jspeech('grammar', {
            version: 'V1.0',
            lang: 'en',
            encoding: 'utf-8',
        });

        _(commands).forOwn((command) => {
            this._generateParams(command);
            this._generateRules(command);
        });

        this._generateAppNames(commands);

        return this._writeFile(this._grammarPath, this._grammar.stringify());
    }

    _generateParams(commands) {
        if (_.isEmpty(commands.params)) {
            return;
        }

        _(commands.params).forOwn((array, key) => {
            if (_.isEmpty(array)) {
                return;
            }
            this._grammar.alt(this._getKey(key, commands.serviceId), array.map(_.lowerCase));
        });
    }

    _generateRules(commands) {
        if (_.isEmpty(commands.rules)) {
            return;
        }

        _(commands.rules).forOwn((value, key) => {
            let params = this._getParamsInRule(value.rule, commands.params);

            const rule = _.reduce(params, (rule, param) => {
                return _.replace(rule, `<${param.toLowerCase()}>`, `<${this._getKey(param, commands.serviceId)}>`)
            }, value.rule.toLowerCase());

            this._grammar.public.rule(this._getKey(key, commands.serviceId), rule);
        });
    }

    _getParamsInRule(rule, params) {
        const regexp = /<\w+>/g;
        const paramsInUse = [];
        let param;

        while ((param = regexp.exec(rule)) != null) {
            const paramStr = param[0];
            const paramKey = paramStr.substring(1, paramStr.length - 1);

            if (!_.get(params, paramKey)) {
                throw new errors.ValidationError(`Unknown parameter ${param} in rule '${rule}'`);
            }

            paramsInUse.push(paramKey);
        }
        return paramsInUse;
    }

    _generateAppNames(commands) {
        const names = _(commands).keys()
            .filter(name => !_.includes(this._excludedAppNames, name))
            .map(_.lowerCase)
            .value();
        if (_.isEmpty(names)) {
            this._grammar.word('appName', ' ');
        } else {
            this._grammar.alt('appName', names);
        }
    }

    _getKey(key, id) {
        return id ? `${key}_${id}` : key;
    }
}

module.exports = GrammarManager;
