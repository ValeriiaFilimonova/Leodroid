'use strict';

const _ = require('lodash');
const router = require('express-promise-router');

const errors = require('../Errors');
const CommonServiceRepository = require('./CommonServiceRepository');

class CommonServiceController {
    constructor(repository) {
        this._requiredProperties = ['serviceName', 'applicationName', 'commands'];
        this._repository = repository;
        this._router = router();

        this._router.put('/', this.addNewService.bind(this));
    }

    router() {
        return this._router;
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

    addNewService(req, res) {
        const body = this.guard(req.body);
        const serviceModel = {
            applicationName: body.applicationName,
            mainClass: body.mainClass,
            dependencies: body.dependencies,
            logFile: body.logFile,
            commands: body.commands,
        };

        return this._repository
            .addNewService(body.serviceName, serviceModel)
            .then(() => {
                return res.status(200).send(serviceModel);
            })
            .catch((err) => {
                return res.status(500).send(err)
            });
    }
}

module.exports = new CommonServiceController(CommonServiceRepository);
