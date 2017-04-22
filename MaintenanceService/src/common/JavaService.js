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
        let classPath = `-cp ${this._dependenciesPath}/*`;

        if (!_.isEmpty(this.dependencies)) {
            classPath += `:${this._dependenciesPath}/${this.directoryName}/*`;
        }

        classPath += `:${JavaService.applicationsPath}/${this.executable}`;

        return `${this._javaBinPath} ${classPath} ${this.mainClass}`;
    }

    toStorageModel() {
        return _.extend(super.toStorageModel(), {
            mainClass: this.mainClass,
            dependencies: !!this.dependencies,
        });
    }
}

module.exports = JavaService;
