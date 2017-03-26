'use strict';

const express = require('express');
const parser = require('body-parser').json();
const logger = require('./Logger');
const errors = require('./Errors');
const CommonServiceController = require('./common/CommonServiceController');

const errorHandler = function (err, req, res, next) {
    if (err instanceof errors.ValidationError) {
        return res.status(400).send({
            error: err.message,
        });
    }
    if (err instanceof errors.NotFoundError) {
        return res.status(404).send({
            error: err.message,
        });
    }
    return res.status(500).send(err.message);
};

const app = express();

app.use(parser);
app.use(logger);

app.use('/storage/services', CommonServiceController.router());

app.use(errorHandler);

const server = app.listen(8888, function () {
    console.log("Listening at http://localhost:%s", server.address().port)
});
