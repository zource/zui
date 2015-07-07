// https://github.com/karma-runner/grunt-karma
module.exports = {
    options: {
        configFile: 'karma.conf.js',
        runnerPort: 9999,
    },
    travis: {
        singleRun: true,
        browsers: ['PhantomJS']
    }
};
