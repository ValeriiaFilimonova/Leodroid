'use strict';

const errors = require('../Errors');
const Service = require('./Service');
const UnitFileManager = require('../helpers/UnitFileManager');
const DataStorageClient = require('../helpers/DataStorageClient');

class ServiceRegister {
    constructor(service) {
        this._service = service;
        this._systemdManager = new UnitFileManager(service);
        this._storageClient = DataStorageClient;
    }

    static add(service) {
        const register = new ServiceRegister(service);

        return register._storageClient.getService(service.serviceName)
            .then((service) => {
                throw new errors.ServiceAddingError(`Application ${service.applicationName} already exists`);
            })
            .catch((err) => {
                if (err.status !== 404) {
                    throw new errors.ServiceAddingError('Failed to add application', err);
                }
            })
            .then(() => register._storageClient.addNewService(service))
            .then(() => register._systemdManager.createUnitFile());

        // create and write unit file
        // add commands to dictionary and restart service
        // send data to data storage service
    }

    static remove(service) {
        // check if stop is needed and remove
        // remove data from data storage
        // remove commands from dictionary but only not used by other services
    }
}

module.exports = ServiceRegister;
