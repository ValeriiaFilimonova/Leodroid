'use strict';

const errors = require('./Errors');

module.exports = function (err, req, res, next) {
    if (err instanceof errors.ValidationError) {
        return res.status(400).send(err.message);
    }
    if (err instanceof errors.NotFoundError) {
        return res.status(404).send(err.message);
    }

    res.status(500).send(err.message);
    next(err);
};
