module.exports = function(grunt) {
    var typeRegEx = /^\s*(?:\{(.*)\})?\s*(?:\$?([^\s^\]\[]+))?\s*(?:\[([^\]]*)\])?\s*(?:-?\s*([\s\S]*))?/;
    var ScssCommentParser = require('scss-comment-parser');
    var annotations = {
        _: {
            alias: {
            }
        },
        pattern: {
            multiple: false,
            parse: function(annotationLine, info, id) {
                return annotationLine;
            }
        },
        param: {
            multiple: true,
            parse: function(annotationLine, info, id) {
                var parsed = typeRegEx.exec(annotationLine);
                var obj = {};

                if (parsed[1]) {
                    obj.type = parsed[1];
                }

                if (parsed[2]) {
                    obj.name = parsed[2];
                } else {
                    env.logger.warn('@parameter must at least have a name. Location: ' + id + ':' + info.commentRange.start + ':' + info.commentRange.end);
                    return undefined;
                }

                if (parsed[3]) {
                    obj['default'] = parsed[3];
                }

                if (parsed[4]) {
                    obj.description = parsed[4];
                }

                return obj;
            }
        },
        type: {
            multiple: false,
            parse: function(annotationLine, info, id) {
                return annotationLine;
            }
        }
    };

    var registry = {
        data: {
            general: {},
            patterns: {}
        },
        addGlobal: function(annotation) {
            var type = annotation.context.type;

            if (!registry.data.general[type]) {
                registry.data.general[type] = [];
            }

            registry.data.general[type].push(annotation);
        },
        addPattern: function(annotation) {
            var pattern = annotation.pattern;
            var type = annotation.context.type;

            if (!registry.data.patterns[pattern]) {
                registry.data.patterns[pattern] = {};
            }

            if (!registry.data.patterns[pattern][type]) {
                registry.data.patterns[pattern][type] = [];
            }

            registry.data.patterns[pattern][type].push(annotation);
        },
        write: function(destinationDir) {
            var jsonContent = JSON.stringify(registry.data.general, null, '  ');
            grunt.file.write(destinationDir + "/_.json", jsonContent);

            for (var pattern in registry.data.patterns) {
                jsonContent = JSON.stringify(registry.data.patterns[pattern], null, '  ');

                grunt.file.write(destinationDir + "/" + pattern + ".json", jsonContent);
            }
        }
    };

    grunt.registerTask("docs-scss", "Parses all docblocks in SCSS files.", function() {
        var options = this.options();
        var scssParser = new ScssCommentParser(annotations, {});

        grunt.file.recurse(options.scssDir, function(abspath, rootdir, subdir, filename) {
            var src = grunt.file.read(abspath);
            var annotations = scssParser.parse(src);

            annotations.forEach(function(annotation) {
                if (annotation.pattern) {
                    registry.addPattern(annotation);
                } else {
                    registry.addGlobal(annotation);
                }
            });
        });

        registry.write(options.dest);
    });
};
