'use strict';

const _ = require('lodash');
const Service = require('./Service');

const FileManager = require('../helpers/FileSystemManager');

class JavaService extends Service {
    constructor(data) {
        super(data);
        this._validate(['mainClass'], data);

        this._javaBinPath = '/usr/bin/java';

        this._mainClass = data.mainClass;
        this._dependencies = data.dependencies || [];
    }

    get mainClass() {
        return this._mainClass;
    }

    get dependencies() {
        return this._dependencies;
    }

    get executionCommand() {
        let classPath = `-cp ${FileManager.librariesDir}/*`;

        if (!_.isEmpty(this.dependencies)) {
            classPath += `:${FileManager.librariesDir}/${this.directoryName}/*`;
        }

        classPath += `:${FileManager.servicesDir}/${this.directoryName}/${this.executable}`;

        return `${this._javaBinPath} ${classPath} ${this.mainClass}`;
    }
}

module.exports = JavaService;
