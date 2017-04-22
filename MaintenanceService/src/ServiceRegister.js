'use strict';

const errors = require('./Errors');
const ServiceBuilder = require('./common/ServiceBuilder');
const SphinxConfigurator = require('./sphinx/SphinxConfigurator');
const UnitFileManager = require('./helpers/UnitFileManager');
const FileManager = require('./helpers/FileSystemManager');
const PackageHelper = require('./helpers/PackageHelper');
const SystemctlExecutor = require('./helpers/SystemctlExecutor');
const DataStorageClient = require('./helpers/DataStorageClient');

class ServiceRegister {
    static add(url) {
        let service;
        return FileManager.prepareTempDirectory()
            .then(() => PackageHelper.downloadPackageAndGetConfig(url))
            .then((config) => service = ServiceBuilder.buildFrom(config))
            .then(() => DataStorageClient.checkServiceExists(service.serviceName))
            .then((exists) => {
                if (exists) {
                    throw new errors.ValidationError(`Application ${service.applicationName} already exists`);
                }
            })
            .then(() => UnitFileManager.createUnitFile(service))
            .then(() => SphinxConfigurator.addCommands(service))
            .then(() => DataStorageClient.addNewService(service))
            .then(() => FileManager.copyFiles(service))
            .then(() => FileManager.removeTempDirectory())
            .then(() => SystemctlExecutor.applyChanges())
            .catch((err) => {
                FileManager.removeTempDirectorySync();

                if (err instanceof errors.ServiceMaintenanceError) {
                    throw err;
                } else {
                    throw  new errors.ServiceMaintenanceError('Failed to install application', err);
                }
            });
    }

    static remove(applicationName) {
        let service;
        return FileManager.prepareTempDirectory()
            .then(() => DataStorageClient.getService(applicationName))
            .then((response) => service = ServiceBuilder.buildFrom(response))
            .catch((err) => {
                if (err.status === 404) {
                    throw new errors.ValidationError(`Application '${applicationName}' doesn't exist`);
                }
                throw err;
            })
            .then(() => SphinxConfigurator.removeCommands(service))
            .then(() => DataStorageClient.removeService(service))
            .then(() => FileManager.removeFiles(service))
            .then(() => FileManager.removeTempDirectory())
            .then(() => SystemctlExecutor.applyChanges())
            .catch((err) => {
                FileManager.removeTempDirectorySync();

                if (err instanceof errors.ServiceMaintenanceError) {
                    throw err;
                } else {
                    throw  new errors.ServiceMaintenanceError('Failed to uninstall application', err);
                }
            });
    }
}

module.exports = ServiceRegister;
