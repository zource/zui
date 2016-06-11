// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
    grunt: {
        options: {
            reload: true
        },
        files: ['Gruntfile.js', 'grunt/**/*.js']
    },
    docs: {
        files: ["docs/**/*.html", "docs/**/*.js"],
        tasks: ['docs'],
        options: {
            livereload: true
        }
    },
    js: {
        files: ["js/**/*.js"],
        tasks: ["lint", "build"],
    },
    sass: {
        files: ["**/*.scss"],
        tasks: ['sass', 'docs'],
        options: {
            livereload: true
        }
    }
};
