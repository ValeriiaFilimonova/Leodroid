'use strict';

const ExecutableService = require('./Service');
const JavaService = require('./JavaService');
const NodeService = require('./NodeService');

class ServiceBuilder {
    static buildFrom(data) {
        const type = data && data.type && data.type.toLowerCase();
        switch (type) {
            case 'java':
                return new JavaService(data);
            case 'nodejs':
                return new NodeService(data);
            default:
                return new ExecutableService(data);
        }
    }
}

module.exports = ServiceBuilder;
