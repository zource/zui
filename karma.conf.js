// Karma configuration
// Generated on Sun Jul 05 2015 14:45:40 GMT+0200 (W. Europe Daylight Time)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'vendor/jquery/dist/jquery.js', watched: true, served: true, included: true},
            {pattern: 'vendor/jasmine-jquery/lib/jasmine-jquery.js', watched: true, served: true, included: true},
            {pattern: 'dist/js/zui.js', watched: true, served: true, included: true},
            {pattern: 'spec/**/*.html', watched: true, served: true, included: true},
            {pattern: 'spec/helpers.js', watched: true, served: true, included: true},
            {pattern: 'spec/**/*Spec.js', watched: true, served: true, included: true}
        ],

        plugins: [
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-safari-launcher',
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox', 'Safari', 'IE', 'PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
}
