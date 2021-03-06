'use strict';

const errors = require('./../Errors');

const BaseRepository = require('../base/BaseRepository');

class ApplicationInfoRepository extends BaseRepository {
    getServiceName(appName) {
        return this.client.getAsync(this._getApplicationKey(appName))
            .then((name) => {
                if (!name) {
                    throw new errors.NotFoundError(appName);
                }
                return name;
            });
    }
}

module.exports = new ApplicationInfoRepository();
