'use strict';

class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    ValidationError: ValidationError,
    NotFoundError: NotFoundError,
};
