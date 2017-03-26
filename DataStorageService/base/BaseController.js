'use strict';

const _ = require('lodash');
const router = require('express-promise-router');

const errors = require('../Errors');

class BaseController {
    constructor(repository) {
        this._requiredProperties = [];
        this._repository = repository;
        this._router = router();
    }

    router() {
        return this._router;
    }

    _respond(resObject, response) {
        resObject.body = response;
        resObject.send(response);
    }

    _guard(propertyName, propertyValue) {
        if (_.isEmpty(propertyValue)) {
            throw new errors.ValidationError(`${propertyName} is required`);
        }
    }

    guard(requestBody) {
        _(this._requiredProperties).forEach(propertyName => {
            this._guard(propertyName, requestBody[propertyName]);
        });

        return requestBody;
    }
}

module.exports = BaseController;
