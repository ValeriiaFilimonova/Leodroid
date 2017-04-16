module.exports = [
    {
        applicationName: 'Droid Application Managing Service',
        serviceName: 'application-managing',
        description: 'Java Systemctl Based Managing Service',
        mainClass: 'ManagingService',
        dependencies: true,
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
    // {
    //     applicationName: 'Droid Data Storage Service',
    //     serviceName: 'data-storage',
    //     description: 'NodeJS Redis Based Data Storage Service'
    // },
    // {
    //     applicationName: 'Droid Maintenance Service',
    //     serviceName: 'application-maintenance',
    //     description: 'NodeJS + Bash Maintenance Service'
    // },
    {
        applicationName: 'Droid Speech Recognition Service',
        serviceName: 'speech-recognition',
        description: 'Java Sphinx Speech Recognition Service',
        mainClass: 'RecognitionService',
        dependencies: true
    },
    {
        applicationName: 'Droid Speech Synthesis Service',
        serviceName: 'speech-synthesis',
        description: 'C++ Espeak Based Speech Synthesis Service'
    }
];
