'use strict';

const bluebird = require('bluebird');
const download = require('download');
const jsonfile = require('jsonfile');
const config = require('../config');
const errors = require('../Errors');

const configFile = config.path.dir.temporary + '/' + config.path.file.config;

class PackageHelper {
    static downloadPackageAndGetConfig(url) {
        return download(url, config.path.dir.temporary, { extract: true })
            .catch((err) => {
                throw new errors.ServiceMaintenanceError(`Failed to get package by ${url}`, err);
            })
            .then(() => bluebird.promisify(jsonfile.readFile)(configFile))
            .catch((err) => {
                throw new errors.ServiceMaintenanceError('Failed to read config.json file', err);
            });
    }
}

module.exports = PackageHelper;
