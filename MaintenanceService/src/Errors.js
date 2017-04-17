'use strict';

class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

class ServiceAddingError extends Error {
    constructor(message, err) {
        super(`${message}\n${err.stack}`);
    }
}

class ServiceRemovingError extends Error {
    constructor(message, err) {
        super(`${message}\n${err.stack}`);
    }
}

module.exports = {
    ValidationError: ValidationError,
    ServiceAddingError: ServiceAddingError,
    ServiceRemovingError: ServiceRemovingError,
};
