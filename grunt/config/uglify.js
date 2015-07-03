// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
    dist: {
        files: {
            "<%= paths.dist %>/js/zui.min.js": ["<%= paths.dist %>/js/zui.js"]
        },
        options: {
            preserveComments: false,
            sourceMap: true,
            sourceMapName: "<%= paths.dist %>/js/zui.min.js.map",
            report: "min",
            beautify: {
                "ascii_only": true
            },
            banner: "/*! Zource ZUI v<%= pkg.version %> | " +
                "(c) Zource | github.com/zource/zui */",
            compress: {
                "hoist_funs": false,
                loops: false,
                unused: false
            }
        }
    }
};
