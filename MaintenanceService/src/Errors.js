'use strict';

class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

class ServiceMaintenanceError extends Error {
    constructor(message, err) {
        super(message);
        this._cause = err;
    }

    get cause() {
        return this._cause;
    }
}

module.exports = {
    ValidationError: ValidationError,
    ServiceMaintenanceError: ServiceMaintenanceError,
};
