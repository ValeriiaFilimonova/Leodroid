module.exports = [
    {
        applicationName: 'Droid Application Managing Service',
        serviceName: 'application-managing',
        description: 'Java Systemctl Based Managing Service',
        commands: {
            rules: {
                startApp: {
                    rule: 'Open the app <appName>',
                    description: 'Starts the given app'
                },
                stopApp: {
                    rule: 'Close the app <appName>',
                    description: 'Stops the given app'
                }
            },
            params: {
                appName: []
            }
        }
    },
    {
        applicationName: 'Droid Maintenance Service',
        serviceName: 'application-maintenance',
        description: 'NodeJS Service for Installing/Uninstalling of New Apps'
    },
    {
        applicationName: 'Droid Speech Recognition Service',
        serviceName: 'speech-recognition',
        description: 'Java Sphinx Speech Recognition Service',
    },
    {
        applicationName: 'Droid Speech Synthesis Service',
        serviceName: 'speech-synthesis',
        description: 'NodeJS Espeak Based Speech Synthesis Service',
        commands: {
            rules: {
                readPoem: {
                    rule: 'Read me the poem',
                    description: 'Reads short version of the poem by Vincent Price'
                },
                sayName: {
                    rule: 'What is your name',
                    description: 'Tells its name'
                }
            },
        }
    },
    {
        applicationName: 'Droid Adruino Moving Service',
        serviceName: 'arduino-moving',
        description: 'Java UPM Based Moving Service',
        commands: {
            rules: {
                move: {
                    rule: 'Move',
                    description: 'Starts moving'
                },
                stop: {
                    rule: 'Stop',
                    description: 'Stops moving'
                },
                changeDirection: {
                    rule: 'Change direction',
                    description: 'Changes moving direction'
                }
            },
        }
    }
];
