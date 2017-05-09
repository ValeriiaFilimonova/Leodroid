'use strict';

const _ = require('lodash');
const childProcess = require("child_process");

class EspeakWrapper {
    constructor() {
        this._exec = childProcess.execSync;
    }

    speak(text, options) {
        if (_.isEmpty(text)) {
            return;
        }

        const espeakArgs = this._transferOptions(options);
        return _.isEmpty(espeakArgs) ?
            this._exec(`espeak "${text}"`) :
            this._exec(`espeak ${espeakArgs} "${text}"`);
    }

    _transferOptions(options) {
        if (_.isEmpty(options)) {
            return null;
        }

        const commandArgs = [
            this._getVolume(options.volume),
            this._getPitch(options.pitch),
            this._getSpeed(options.speed),
            this._getWordGap(options.wordGap),
            this._getCapitalsPitch(options.capitals),
            this._getVoice(options.voice),
        ];

        return _.reduce(commandArgs, (result, argument) => {
            if (argument) {
                return `${result} ${argument}`;
            }
            return result;
        }, '');
    }

    _getVolume(amplitude) {
        if (_.isInteger(amplitude) && _.inRange(amplitude, 0, 200)) {
            return `-a ${amplitude}`;
        }
    }

    _getPitch(pitch) {
        if (_.isInteger(pitch) && _.inRange(pitch, 0, 100)) {
            return `-p ${pitch}`;
        }
    }

    _getSpeed(speed) {
        if (_.isInteger(speed) && _.inRange(speed, 80, 500)) {
            return `-s ${speed}`;
        }
    }

    _getWordGap(gap) {
        if (_.isInteger(gap) && _.inRange(gap, 1, 25)) {
            return `-g ${gap}`;
        }
    }

    _getCapitalsPitch(pitch) {
        if (_.isInteger(pitch) && _.inRange(pitch, 0, 100)) {
            return `-k ${pitch}`;
        }
    }

    _getVoice(voiceOptions) {
        if (!voiceOptions) {
            return '';
        }

        const voices = voiceOptions.language && this._exec(`espeak --voices=${voiceOptions.language}`);
        const voiceOpts = this._getVoiceOptions(voiceOptions);

        if (_.trim(voices).split('\n').length > 1) {
            return _.isEmpty(voiceOpts) ?
                `-v ${voiceOptions.language}` :
                `-v ${voiceOptions.language}+${voiceOpts}`;
        } else {
            return _.isEmpty(voiceOpts) ?
                '' :
                `-v ${voiceOpts}`;
        }
    }

    _getVoiceOptions(voiceOptions) {
        if (voiceOptions.whisper) {
            switch (voiceOptions.gender) {
                case 'female':
                    return 'whisperf';
                case 'male':
                default:
                    return 'whisper';
            }
        }

        if (voiceOptions.croak) {
            return 'croak';
        }

        switch (voiceOptions.gender) {
            case 'female': {
                let index = 1;
                if (_.isInteger(voiceOptions.index) && _.inRange(voiceOptions.index, 0, 5)) {
                    index = voiceOptions.index;
                }
                return `f${index}`;
            }
            case 'male':
            default: {
                let index = 1;
                if (_.isInteger(voiceOptions.index) && _.inRange(voiceOptions.index, 0, 8)) {
                    index = voiceOptions.index;
                }
                return `m${index}`;
            }
        }
    }
}

module.exports = new EspeakWrapper();
