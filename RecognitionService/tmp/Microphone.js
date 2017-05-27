/*The MIT License (MIT)

 Copyright (c) 2016 Ashish Bajaj bajaj.ashish@gmail.com

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

const spawn = require('child_process').spawn;
const SilenceTransformation = require('./SilenceTransformation');
const stream = require('stream');

class Microphone {
    constructor(options) {
        const opts = options || {};
        this._debugEnabled = opts.debugEnabled || false;
        this._audioProcess = null;
        this._infoStream = new stream.PassThrough();

        this._audioStream = new SilenceTransformation({
            silentThreshold: opts.exitOnSilence || 0,
            debug: this._debugEnabled,
        });

        this._rate = opts.rate || 16000;
        this._channels = opts.channels || 1;
        this._device = opts.device || 'plughw:1,0';
        this._format = this._getAudioFormat({
            ending: opts.ending || 'little',
            encoding: opts.encoding || 'signed-integer',
            bitwidth: opts.bitwidth || 16,
        });

        if (this._debugEnabled) {
            this._infoStream.on('data', function (data) {
                console.info("Received Info: " + data);
            });
            this._infoStream.on('error', function (error) {
                console.error("Error in Info Stream: " + error);
            });
        }
    }

    get audioStream() {
        return this._audioStream;
    }

    start() {
        const audioStream = this._audioStream;

        if (this._audioProcess === null) {
            this._audioProcess = spawn('arecord',
                ['-c', this._channels, '-r', this._rate, '-f', this._format, '-D', this._device],
                this._getAudioProcessOptions(this._debugEnabled));

            this._audioProcess.on('exit', function (code, signal) {
                if (code !== null && signal === null) {
                    audioStream.emit('audioProcessExited');

                    if (this._debugEnabled) {
                        console.warn("Recording exited with code = %d", code);
                    }
                }
            });

            this._audioProcess.stdout.pipe(this._audioStream);

            if (this._debugEnabled) {
                this._audioProcess.stderr.pipe(this._infoStream);
            }
            this._audioStream.emit('recordingStarted');
        } else {
            if (this._debugEnabled) {
                throw new Error("Microphone already started!");
            }
        }
    }

    stop() {
        if (this._audioProcess !== null) {
            this._audioProcess.kill('SIGTERM');
            this._audioProcess = null;
            this._audioStream.emit('recordingStopped');
        }
    }

    pause() {
        if (this._audioProcess !== null) {
            this._audioProcess.kill('SIGSTOP');
            this._audioStream.pause();
            this._audioStream.emit('recordingPaused');
        }
    };

    resume() {
        if (this._audioProcess !== null) {
            this._audioProcess.kill('SIGCONT');
            this._audioStream.resume();
            this._audioStream.emit('recordingResumed');
        }
    }

    _getAudioProcessOptions(debugEnabled) {
        const audioProcessOptions = {
            stdio: ['ignore', 'pipe', 'ignore']
        };

        if (debugEnabled) {
            audioProcessOptions.stdio[2] = 'pipe';
        }

        return audioProcessOptions;
    }

    _getAudioFormat(options) {
        let formatEnding, formatEncoding;

        if (options.encoding === 'unsigned-integer') {
            formatEncoding = 'U';
        } else {
            formatEncoding = 'S';
        }

        if (options.ending === 'big') {
            formatEnding = 'BE';
        } else {
            formatEnding = 'LE';
        }

        return formatEncoding + options.bitwidth + '_' + formatEnding;
    }
}

module.exports = Microphone;