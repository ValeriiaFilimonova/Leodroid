'use strict';

const BaseController = require('../base/BaseController');
const ServiceStatusRepository = require('./ServiceStatusRepository');

class ServiceStatusController extends BaseController {
    constructor() {
        super(ServiceStatusRepository);

        this._router.get('/', this.getStatuses.bind(this));
        this._router.patch('/', this.updateStatuses.bind(this));
    }

    getStatuses(req, res) {
        return this._repository.getStatuses()
            .then((statuses) => this._respond(res, statuses));
    }

    updateStatuses(req, res) {
        return this._repository.updateStatuses(req.body)
            .then(() => res.status(200).send());
    }
}

module.exports = new ServiceStatusController();
