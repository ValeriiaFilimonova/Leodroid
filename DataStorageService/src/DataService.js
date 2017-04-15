'use strict';

delete process.env["DEBUG_FD"];

const _ = require('lodash');
const bluebird = require('bluebird');
const express = require('express');
const parser = require('body-parser').json();
const logger = require('./Logger');
const errorHandler = require('./ErrorHandler');
const terminationHandler = require('./TerminationHandler');
const defaultServices = require('./DefaultServices');
const CommonServiceController = require('./common/CommonServiceController');
const ServiceStatusController = require('./status/ServiceStatusController');
const ApplicationInfoController = require('./app/ApplicationInfoController');

const app = express();

app.use(parser);
app.use(logger);

app.use('/storage/services', CommonServiceController.router);
app.use('/storage/statuses', ServiceStatusController.router);
app.use('/storage/applications', ApplicationInfoController.router);

app.use(errorHandler);

//TODO try to do something with it
CommonServiceController.repository.client.on('ready', (err) => {
    if (err) terminationHandler.handleErrorWithExit(err);

    bluebird
        .map(defaultServices, (service) => CommonServiceController
            .repository.addOrUpdateService(service.serviceName, _.omit(service, 'serviceName')))
        .then(() => console.log('Default services initialized'));
});

const server = app.listen(8888, function () {
    terminationHandler.setupHandlers();
    console.log("Listening at http://localhost:%s", server.address().port)
});
