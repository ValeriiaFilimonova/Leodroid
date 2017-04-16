'use strict';

const ExecutableService = require('./Service');
const JavaService = require('./JavaService');

class ServiceBuilder {
    static build(data) {
        switch (data.type.toLowerCase()) {
            case 'ava':
                return new JavaService(data);
            default:
                return new ExecutableService(data);
        }
    }
}

module.exports = ServiceBuilder;
