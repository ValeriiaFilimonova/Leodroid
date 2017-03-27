'use strict';

const BaseController = require('../base/BaseController');
const ApplicationInfoRepository = require('./ApplicationInfoRepository');

class ApplicationInfoController extends BaseController {
    constructor() {
        super(ApplicationInfoRepository);

        this._router.get('/:appName/_service', this.getServiceName.bind(this));
    }

    getServiceName(req, res) {
        return this._repository
            .getServiceName(req.params.appName)
            .then((name) => this._respond(res, name));
    }
}

module.exports = new ApplicationInfoController();
