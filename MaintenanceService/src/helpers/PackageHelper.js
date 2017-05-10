'use strict';

const fs = require('fs');
const bluebird = require('bluebird');
const download = require('download');
const decompress = require('decompress');
const dropbox = require('dropbox');
const jsonfile = require('jsonfile');
const config = require('../config');
const errors = require('../Errors');

const dropboxClient = new dropbox({ accessToken: config.dataStorage.dropbox.accessToken });
const configFile = config.path.dir.temporary + '/' + config.path.file.config;

class PackageHelper {
    static downloadPackageAndGetConfig(options) {
        const downloadAndUnzip = options.url ?
            PackageHelper.downloadByUrl(options.url) :
            PackageHelper.downloadDropboxPackage(options.name);

        return downloadAndUnzip
            .then(() => bluebird.promisify(jsonfile.readFile)(configFile))
            .catch((err) => {
                throw new errors.ServiceMaintenanceError('Failed to read config.json file', err);
            });
    }

    static downloadByUrl(url) {
        return download(url, config.path.dir.temporary, { extract: true })
            .catch((err) => {
                throw new errors.ServiceMaintenanceError(`Failed to get package by ${url}`, err);
            });
    }

    static downloadDropboxPackage(name) {
        const writeFile = bluebird.promisify(fs.writeFile);
        const fileName = `${name}.zip`;
        const filePath = `${config.path.dir.temporary}/${fileName}`;

        return dropboxClient.filesDownload({ path: '/' + fileName })
            .then((file) => writeFile(filePath, file.fileBinary, 'binary')
                .then(() => decompress(filePath, config.path.dir.temporary)))
            .catch((err) => {
                throw new errors.ServiceMaintenanceError(`Failed to get package '${name}' from dropbox`, err);
            });
    }
}

module.exports = PackageHelper;
