'use strict';

const Service = require('./Service');
const UnitFileManager = require('../systemd/UnitFileManager');

class ServiceRegister {
    constructor(service) {
        this._service = service;
        this._systemdManager = new UnitFileManager(service);
    }

    static add(service) {
        return new ServiceRegister(service)
            ._systemdManager.createUnitFile();
        // add commands to dictionary and restart service
        // send data to data storage service
    }

    static remove(service) {
        // check if stop is needed
        return new ServiceRegister(service)
            ._systemdManager.removeUnitFile();
        // remove data from data storage
        // remove commands from dictionary but only not used by other services
    }
}

module.exports = ServiceRegister;
