'use strict';

const ExecutableService = require('./Service');
const JavaService = require('./JavaService');

class ServiceBuilder {
    static buildFrom(data) {
        const type = data && data.type && data.type.toLowerCase();
        switch (type) {
            case 'java':
                return new JavaService(data);
            default:
                return new ExecutableService(data);
        }
    }
}

module.exports = ServiceBuilder;
