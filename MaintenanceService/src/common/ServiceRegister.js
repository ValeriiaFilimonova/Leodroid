'use strict';

const errors = require('../Errors');
const Service = require('./Service');
const SphinxConfigurator = require('../sphinx/SphinxConfigurator');
const DataStorageClient = require('../helpers/DataStorageClient');
const UnitFileManager = require('../helpers/UnitFileManager');

class ServiceRegister {
    constructor(service) {
        this._service = service;
        this._sphinxConfigurator = SphinxConfigurator;
        this._storageClient = DataStorageClient;
        this._systemdManager = new UnitFileManager(service);
    }

    static add(service) {
        const register = new ServiceRegister(service);

        return register._storageClient.getService(service.serviceName)
            .then((service) => {
                throw new errors.ValidationError(`Application ${service.applicationName} already exists`);
            })
            .catch((err) => {
                if (err.status !== 404) throw err;
            })
            .then(() => register._systemdManager.createUnitFile())
            .then(() => register._sphinxConfigurator.addCommands(service))
            .then(() => register._storageClient.addNewService(service))
            .catch((err) => {
                throw new errors.ServiceAddingError(`Error installing application '${service.applicationName}'`, err);
            });
    }

    static remove(service) {
        // check if stop is needed and remove
        // remove data from data storage
        // remove commands from dictionary but only not used by other services
    }
}

module.exports = ServiceRegister;
