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
        description: 'C++ Espeak Based Speech Synthesis Service'
    }
];
