'use strict';

const _ = require('lodash');
const morgan = require('morgan');

morgan.token('req_body', (req) => JSON.stringify(req.body, null, '\t'));
morgan.token('res_body', (req, res) => JSON.stringify(res.body, null, '\t'));

const loggerHandler = function (tokens, req, res) {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const head = _.join([method, url, status], ' ');

    if (_.includes([400, 404], _.toNumber(status))) {
        return head;
    }
    if (method === 'DELETE') {
        return head;
    }
    if (method === 'GET') {
        return head + '. Response body:\n' + tokens.res_body(req, res);
    }
    if (_.includes(['POST', 'PUT', 'PATCH'], method)) {
        return head + '. Request body:\n' + tokens.req_body(req);
    }
};

module.exports = morgan(loggerHandler);
