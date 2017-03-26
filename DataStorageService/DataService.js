'use strict';

const express = require('express');
const parser = require('body-parser');
const logger = require('./Logger');
const errors = require('./Errors');
const CommonServiceController = require('./common/CommonServiceController');

const errorHandler = function (err, req, res, next) {
    if (err instanceof errors.ValidationError) {
        res.status(400).send({
            error: err.message,
        });
    }
    next(err);
};

const app = express();

app.use(parser.json());
app.use(logger);

app.use('/storage/services', CommonServiceController.router());

app.use(errorHandler);

const server = app.listen(8888, function () {
    console.log("Listening at http://localhost:%s", server.address().port)
});
