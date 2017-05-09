'use strict';

const Microphone = require('./Microphone');
const fs = require('fs');

const micInstance = new Microphone({
    rate: 16000,
    channels: 1,
    debugEnabled: false,
    exitOnSilence: 3,
    device: 'plughw:0,0'
});

const micInputStream = micInstance.audioStream;

const outputFileStream = fs.WriteStream('output.wav');

micInputStream.pipe(outputFileStream);

micInputStream.on('data', function (data) {
    console.log("Received Input Stream: " + data.length);
});

micInputStream.on('error', function (err) {
    console.log("Error in Input Stream: " + err);
});

micInputStream.on('recordingStarted', function () {
    console.log("Recording started");
});

micInputStream.on('recordingStopped', function () {
    console.log("Recording stopped");
});

micInputStream.on('silence', function () {
    console.log("Got SIGNAL silence");
    micInstance.stop();
});

micInputStream.on('processExitComplete', function () {
    console.log("Got SIGNAL processExitComplete");
});

micInstance.start();