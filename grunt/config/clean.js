// https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
    dist: {
        src: [
            "<%= paths.dist %>/**/*",
            "<%= paths.dist %>/docs/build/**/*"
        ]
    },
};
