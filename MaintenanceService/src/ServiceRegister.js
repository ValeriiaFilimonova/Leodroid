'use strict';

const errors = require('./Errors');
const SphinxConfigurator = require('./sphinx/SphinxConfigurator');
const DataStorageClient = require('./helpers/DataStorageClient');
const UnitFileManager = require('./helpers/UnitFileManager');

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
                throw new errors.ServiceMaintenanceError(`Error installing application '${service.applicationName}'`, err);
            });
    }

    static remove(service) {
        const register = new ServiceRegister(service);
        return register._systemdManager.removeUnitFile()
            .then(() => register._sphinxConfigurator.removeCommands(service))
            .then(() => register._storageClient.removeService(service))
            .catch((err) => {
                throw new errors.ServiceMaintenanceError(`Error uninstalling application '${service.applicationName}'`, err);
            });
    }
}

module.exports = ServiceRegister;
