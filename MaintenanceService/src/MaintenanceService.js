'use strict';

const data = require('./service.json');

const ServiceBuilder = require('./common/ServiceBuilder');
const ServiceRegister = require('./common/ServiceRegister');

const serviceInstance = ServiceBuilder.build(data);

ServiceRegister.add(serviceInstance)
    .then(() => process.exit(0))
    .catch((err) => console.err(err));