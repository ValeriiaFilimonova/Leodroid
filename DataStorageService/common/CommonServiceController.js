'use strict';

const _ = require('lodash');
const router = require('express-promise-router');

const errors = require('../Errors');
const CommonServiceRepository = require('./CommonServiceRepository');

class CommonServiceController {
    constructor(repository) {
        this._requiredProperties = ['applicationName', 'commands'];
        this._repository = repository;
        this._router = router();

        this._router.get('/:serviceName', this.getService.bind(this));
        this._router.put('/:serviceName', this.upsertService.bind(this));
        this._router.delete('/:serviceName', this.removeService.bind(this));
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

    getService(req, res) {
        return this._repository
            .getServiceByName(req.params.serviceName)
            .then((info) => this._respond(res, info));
    }

    upsertService(req, res) {
        const body = this.guard(req.body);
        const serviceModel = {
            applicationName: body.applicationName,
            mainClass: body.mainClass,
            dependencies: body.dependencies,
            logFile: body.logFile,
            commands: body.commands,
        };

        return this._repository
            .addOrUpdateService(req.params.serviceName, serviceModel)
            .then((service) => res.send(service));
    }

    removeService(req, res) {
        return this._repository
            .removeService(req.params.serviceName)
            .then(() => res.status(204).send());
    }
}

module.exports = new CommonServiceController(CommonServiceRepository);
