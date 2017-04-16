'use strict';

class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

class ServiceAddingError extends Error {
    constructor(message, err) {
        super(`${message}: ${err.message}`);
    }
}

class ServiceRemovingError extends Error {
    constructor(message, err) {
        super(`${message}: ${err.message}`);
    }
}

module.exports = {
    ValidationError: ValidationError,
    ServiceAddingError: ServiceAddingError,
    ServiceRemovingError: ServiceRemovingError,
};
