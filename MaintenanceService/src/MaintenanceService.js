'use strict';

const _ = require('lodash');

const JavaService = require('./common/JavaService');
const ServiceRegister = require('./common/ServiceRegister');

const service = {
    applicationName: 'Hello World',
    description: 'Some text here',
    type: 'Java', // Exec or Java
    mainClass: 'Hello',
    dependencies: ['lol.jar', 'molol.jar'],
    commands: ['Say Hello']
};

//TODO add service builder to build service instance from config file
const serviceInstance = new JavaService(service);
ServiceRegister.add(serviceInstance);
