'use strict';

const express = require('express');
const parser = require('body-parser').json();
const logger = require('./Logger');
const errorHandler = require('./ErrorHandler');

const CommonServiceController = require('./common/CommonServiceController');
const ServiceStatusController = require('./status/ServiceStatusController');
const ApplicationInfoController = require('./app/ApplicationInfoController');

const app = express();

app.use(parser);
app.use(logger);

app.use('/storage/services', CommonServiceController.router());
app.use('/storage/statuses', ServiceStatusController.router());
app.use('/storage/applications', ApplicationInfoController.router());

app.use(errorHandler);

//TODO handle terminating
const server = app.listen(8888, function () {
    console.log("Listening at http://localhost:%s", server.address().port)
});
