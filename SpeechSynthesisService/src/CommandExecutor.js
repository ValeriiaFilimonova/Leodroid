'use strict';

const poem = require('./VincentPoem.json');
const synthesiser = require('./EspeakWrapper');
const logger = require('log4js').getLogger('CommandExecutor');

class CommandExecutor {
    constructor() {
        this._log = function (command) {
            logger.info('Executed command:', `"${command}"`);
        };
        this._speak = synthesiser.speak.bind(synthesiser);
    }

    _tellTheName() {
        this._speak("My name is Leo");
    }

    _tellThePoem() {
        poem.forEach((piece) => this._speak(piece.text, piece.options));
    }

    execute(command) {
        switch (command) {
            case 'tell me the poem': {
                this._log(command);
                this._tellThePoem();
                break;
            }
            case 'what is your name': {
                this._log(command);
                this._tellTheName();
                break;
            }
        }
    }
}

module.exports = new CommandExecutor();
