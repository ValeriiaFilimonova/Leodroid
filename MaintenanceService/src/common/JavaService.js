'use strict';

const _ = require('lodash');
const Service = require('./Service');

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
        let classPath = `-cp ${this._librariesPath}/*`;

        if (!_.isEmpty(this.dependencies)) {
            classPath += `:${this._librariesPath}/${this.directoryName}/*`;
        }

        classPath += `:${this._servicesPath}/${this.directoryName}/${this.executable}`;

        return `${this._javaBinPath} ${classPath} ${this.mainClass}`;
    }
}

module.exports = JavaService;
