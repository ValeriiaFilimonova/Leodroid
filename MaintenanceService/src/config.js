'use strict';

module.exports = {
    path: {
        dir: {
            models: process.env.MODELS_DIRECTORY || '/home/root/share/models/en',
            temporary: process.env.TEMP_DIRECTORY || '/home/root/temp',
            services: process.env.EXE_DIRECTORY || '/home/root/exe',
            libraries: process.env.LIB_DIRECTORY || '/home/root/lib',
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
