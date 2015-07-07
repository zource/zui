// https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
    dist: {
        src: [
            "<%= paths.dist %>/**/*",
            "<%= paths.docs %>/build/**/*",
            "<%= paths.docs %>/patterns/font/examples/font/zui.html"
        ]
    },
};
