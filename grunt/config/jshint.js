// https://github.com/gruntjs/grunt-contrib-jshint
module.exports = {
    dist: {
        options: {
            jshintrc: true
        },
        src: [
            "Gruntfile.js",
            "build/tasks/**/*.js",
            "docs/assets/js/**/*.js",
            "js/**/*.js",
            "test/**/*.js"
        ]
    }

};
