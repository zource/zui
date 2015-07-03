// https://github.com/gruntjs/grunt-contrib-sass
module.exports = {
    src: {
        options: {
            loadPath: [
                "<%= paths.scss %>"
            ],
            style: "expanded",
            sourcemap: "none",
            trace: true,
            unixNewlines: true
        },
        files: {
            "<%= paths.dist %>/css/zui.css": "<%= paths.scss %>/zui.scss"
        }
    },
    dist: {
        options: {
            loadPath: [
                "<%= paths.scss %>"
            ],
            style: "compressed",
            sourcemap: "inline",
            trace: true,
            unixNewlines: true
        },
        files: {
            "<%= paths.dist %>/css/zui.min.css": "<%= paths.scss %>/zui.scss"
        }
    },
    docs: {
        options: {
            loadPath: [
                "./scss"
            ],
            style: "compressed",
            sourcemap: "none",
            trace: true,
            unixNewlines: true
        },
        files: {
            "<%= paths.docs %>/build/css/docs.css": "<%= paths.docs %>/assets/scss/docs.scss"
        }
    }
};
