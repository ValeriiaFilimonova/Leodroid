'use strict';

delete process.env["DEBUG_FD"];

const _ = require('lodash');
const bluebird = require('bluebird');
const express = require('express');
const parser = require('body-parser').json();
const app = express();

const ServiceRegister = require('./ServiceRegister');

app.use(parser);
app.post('/', (req, res, next) => {
    console.info(`[${new Date()}]: POST`, req.body);

    const url = _.get(req, 'body.url');
    const name = _.get(req, 'body.application');

    if (url) {
        ServiceRegister.add(url)
            .then(() => res.sendStatus(201))
            .catch((err) => next(err));
    }

    if (name) {
        ServiceRegister.remove(name)
            .then(() => res.sendStatus(204))
            .catch((err) => next(err));
    }
});

app.use((err, req, res, next) => {
    console.trace(err);
    return res.status(500).send({
        error: err.message,
        cause: err.cause && err.cause.message,
    });
});

const terminationHandler = function () {
    console.info("Service stopped");
    process.exit(0);
};

const server = app.listen(9999, function () {
    process.on('SIGTERM', terminationHandler);
    process.on('SIGINT', terminationHandler);

    console.info("Listening at http://localhost:%s", server.address().port)
});
