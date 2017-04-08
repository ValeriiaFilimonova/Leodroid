'use strict';

const terminationHandler = function () {
    console.info("Server stopped");
    process.exit(0);
};

module.exports = {
    setupHandlers: function () {
        process.on('SIGINT', terminationHandler);
        process.on('SIGTERM', terminationHandler);
    },
};
