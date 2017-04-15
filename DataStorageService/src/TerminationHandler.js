'use strict';

const terminationHandler = function () {
    console.info("Server stopped");
    process.exit(0);
};

const errorHandler = function (err) {
    console.error(err);
    process.exit(1);
};

module.exports = {
    setupHandlers: function () {
        process.on('SIGINT', terminationHandler);
        process.on('SIGTERM', terminationHandler);
    },
    handleErrorWithExit: errorHandler,
};
