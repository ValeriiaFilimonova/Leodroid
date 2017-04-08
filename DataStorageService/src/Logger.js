'use strict';

const _ = require('lodash');
const morgan = require('morgan');

morgan.token('req_body', (req) => JSON.stringify(req.body, null, '\t'));
morgan.token('res_body', (req, res) => JSON.stringify(res.body, null, '\t'));

const verbs = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};

const errorStatuses = [400, 404, 500];
const reqBodyMethods = [verbs.POST, verbs.PUT, verbs.PATCH];

const loggerHandler = function (tokens, req, res) {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const head = _.join([method, url, status], ' ');

    if (_.includes(errorStatuses, _.toNumber(status))) {
        return head;
    }
    if (method === verbs.DELETE) {
        return head;
    }
    if (method === verbs.GET) {
        const body = tokens.res_body(req, res);
        return `${head}. Response body:\n${body}`;
    }
    if (_.includes(reqBodyMethods, method)) {
        const body = tokens.req_body(req);
        return `${head}. Request body:\n${body}`;
    }
};

module.exports = morgan(loggerHandler);
