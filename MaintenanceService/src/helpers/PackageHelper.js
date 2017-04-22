'use strict';

const bluebird = require('bluebird');
const download = require('download');
const jsonfile = require('jsonfile');
const errors = require('../Errors');
const FileManager = require('./FileSystemManager');

class PackageHelper {
    static downloadPackageAndGetConfig(url) {
        return download(url, FileManager.tempDir, { extract: true })
            .catch((err) => {
                throw new errors.ServiceMaintenanceError(`Failed to get package by ${url}`, err);
            })
            .then(() => bluebird.promisify(jsonfile.readFile)(FileManager.configFile))
            .catch((err) => {
                throw new errors.ServiceMaintenanceError('Failed to read config.json file', err);
            });
    }
}

module.exports = PackageHelper;
