'use strict';

const errors = require('../Errors');
const Service = require('./Service');
const ServiceBuilder = require('./ServiceBuilder');
const SphinxConfigurator = require('../sphinx/SphinxConfigurator');
const DataStorageClient = require('../helpers/DataStorageClient');
const UnitFileManager = require('../helpers/UnitFileManager');

class ServiceRegister {
    constructor(service) {
        this._sphinxConfigurator = SphinxConfigurator;
        this._storageClient = DataStorageClient;
        this._systemdManager = new UnitFileManager(service);
    }

    static add(service) {
        const register = new ServiceRegister(service);
        return register._systemdManager.createUnitFile()
            .then(() => register._sphinxConfigurator.addCommands(service))
            .then(() => register._storageClient.addNewService(service))
            .catch((err) => {
                throw new errors.ServiceAddingError(`Error installing application '${service.applicationName}'`, err);
            });
        // copy dependencies if exists
    }

    static remove(service) {
        const register = new ServiceRegister(service);
        return register._systemdManager.removeUnitFile()
            .then(() => register._sphinxConfigurator.removeCommands(service))
            .then(() => register._storageClient.removeService(service))
            .catch((err) => {
                throw new errors.ServiceRemovingError(`Error uninstalling application '${service.applicationName}'`, err);
            });
        // remove folder with dependencies if exists
    }
}

module.exports = ServiceRegister;
