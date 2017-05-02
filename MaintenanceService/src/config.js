'use strict';

const servicesPath = process.env.EXE_DIRECTORY || '/usr/share/droid-system';

module.exports = {
    path: {
        dir: {
            models: process.env.MODELS_DIRECTORY || servicesPath + '/models/en',
            temporary: process.env.TEMP_DIRECTORY || servicesPath + '/temp',
            services: servicesPath,
            libraries: process.env.LIB_DIRECTORY || '/usr/lib/droid-system',
            systemd: process.env.UNITS_DIRECTORY || '/etc/systemd/system',
        },
        file: {
            fullDictionary: 'dictionary.dict.full',
            dictionary: 'dictionary.dict',
            grammar: 'grammar.gram',
            config: 'config.json',
        }
    },
    dataStorage: {
        host: 'http://localhost:8888',
    }
};
