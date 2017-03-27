'use strict';

const terminationHandler = function () {
    process.exit(0);
};

module.exports = {
    setupHandlers: function () {
        process.on('SIGINT', terminationHandler);
        process.on('SIGTERM', terminationHandler);
    },
};
