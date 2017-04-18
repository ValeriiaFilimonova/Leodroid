'use strict';

const data = require('./service.json');
const errors = require('./Errors');
const ServiceBuilder = require('./common/ServiceBuilder');
const ServiceRegister = require('./common/ServiceRegister');
const DataStorageClient = require('./helpers/DataStorageClient');

const service = ServiceBuilder.build(data);
let add = false;
// add = true;

if (add) {
    DataStorageClient.getService(service.serviceName)
        .then((service) => {
            throw new errors.ValidationError(`Application ${service.applicationName} already exists`);
        })
        .catch((err) => {
            if (err.status !== 404) throw err;
        })
        .then(() => ServiceRegister.add(service))
        .catch((err) => {
            console.trace(err);
            process.exit(1)
        })
        .then(() => process.exit(0));
} else {
    DataStorageClient.getService(service.serviceName)
        .then((response) => ServiceBuilder.build(response))
        .catch((err) => {
            if (err.status === 404) {
                throw new errors.ValidationError(`Application ${service.applicationName} doesn't exist`);
            }
            throw err;
        })
        .then((service) => ServiceRegister.remove(service))
        .catch((err) => {
            console.trace(err);
            process.exit(1)
        })
        .then(() => process.exit(0));
}