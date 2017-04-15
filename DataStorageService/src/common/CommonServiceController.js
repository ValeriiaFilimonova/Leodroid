'use strict';

const BaseController = require('../base/BaseController');
const CommonServiceRepository = require('./CommonServiceRepository');

class CommonServiceController extends BaseController {
    constructor() {
        super(CommonServiceRepository);
        this._requiredProperties = ['applicationName', 'commands'];

        this._router.get('/', this.getAllServices.bind(this));
        this._router.get('/_commands', this.getAllCommands.bind(this));
        this._router.get('/:serviceName', this.getService.bind(this));
        this._router.put('/:serviceName', this.upsertService.bind(this));
        this._router.delete('/:serviceName', this.removeService.bind(this));
    }

    getAllServices(req, res) {
        return this._repository.getAllServices()
            .then((info) => this._respond(res, info));
    }

    getAllCommands(req, res, next) {
        return this._repository.getAllCommands()
            .then((commands) => this._respond(res, commands));
    }

    getService(req, res) {
        return this._repository
            .getServiceByName(req.params.serviceName)
            .then((info) => this._respond(res, info));
    }

    upsertService(req, res) {
        const body = this.guard(req.body);
        const serviceModel = {
            identifier: body.identifier,
            applicationName: body.applicationName,
            description: body.description,
            mainClass: body.mainClass,
            dependencies: body.dependencies,
            commands: body.commands,
        };

        return this._repository
            .addOrUpdateService(req.params.serviceName, serviceModel)
            .then((service) => res.status(200).send(service));
    }

    removeService(req, res) {
        return this._repository
            .removeService(req.params.serviceName)
            .then(() => res.status(204).send());
    }
}

module.exports = new CommonServiceController();
