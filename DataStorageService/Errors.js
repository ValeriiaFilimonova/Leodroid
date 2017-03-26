'use strict';

class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

class NotFoundError extends Error {
    constructor(serviceName) {
        super(`${serviceName} service doesn't exist`);
    }
}

module.exports = {
    ValidationError: ValidationError,
    NotFoundError: NotFoundError,
};
