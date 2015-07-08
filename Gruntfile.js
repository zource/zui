module.exports = function(grunt) {
    "use strict";

    var project = {
        pkg: grunt.file.readJSON("package.json"),
        paths: {
            get config() {
                return this.grunt + "config/";
            },
            build: "build/",
            dist: "build/dist/",
            docs: "docs/",
            grunt: "grunt/",
            js: "js/",
            scss: "scss/",
            spec: "spec/",
            vendor: grunt.file.readJSON(".bowerrc").directory + "/"
        },
        files: {
            get config() {
                return project.paths.config + "*.js";
            },
            grunt: "Gruntfile.js",
            js: ["js/zui.js", "js/zui/*.js"],
            scss: ["scss/zui.scss"]
        }
    };

    require("load-grunt-config")(grunt, {
        configPath: require("path").join(process.cwd(), project.paths.config),
        data: project
    });

    grunt.loadTasks("grunt/tasks");
    grunt.registerTask("docs", ["copy:docs", "sass:docs", "docs-scss", "docs-build"]);
    grunt.registerTask("lint", ["jsonlint", "jshint", "jscs"]);
    grunt.registerTask("build", ["build-js", "uglify", "webfont", "sass:src", "sass:dist", "copy:build"]);
    grunt.registerTask("default", ["lint", "build"]);
};
