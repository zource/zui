module.exports = function(grunt) {
    var swig = require('swig');
    var path = require('path');
    var hljs = require('highlight.js');

    var highlightCallback = function(input, idx) {
        return '<div class="code-container"><pre><code lang="html">'
            + hljs.highlight('html', input).value
            + '</code></pre></div>';
    };
    highlightCallback.safe = true;

    swig.setFilter("highlight", highlightCallback);

    var loadFileContent = function(tpl) {
        if (grunt.file.exists(tpl)) {
            return grunt.file.read(tpl);
        }

        return '';
    };

    var loadPatternExamples = function(patternFile, json, options) {
        json.exampleData = {};

        if (json.examples) {
            json.examples.forEach(function(example) {
                var exampleDir = options.patternsDir
                    + "/"
                    + path.dirname(patternFile)
                    + "/examples/"
                    + example.toLowerCase().replace(' ', '-');

                json.exampleData[example] = {};
                json.exampleData[example].markupHtml = loadFileContent(exampleDir + "/markup.html");
                json.exampleData[example].exampleHtml = loadFileContent(exampleDir + "/example.html");
            });
        }
    };

    var loadPatternScss = function(patternFile, json, options) {
        var scssPath = options.scssDir + "/" + path.dirname(patternFile) + ".json";

        if (grunt.file.exists(scssPath)) {
            var scssJson = grunt.file.readJSON(scssPath);

            json.sass = {};

            if (scssJson.function) {
                json.sass.functions = scssJson.function;
            }

            if (scssJson.mixin) {
                json.sass.mixins = scssJson.mixin;
            }

            if (scssJson.variable) {
                json.sass.variables = scssJson.variable;
            }
        }
    };

    var loadPatterns = function(options) {
        var result = [];
        var patternFiles = grunt.file.expand({
            "cwd": options.patternsDir
        }, [
            "**/pattern.json"
        ]);

        patternFiles.forEach(function(patternFile) {
            var json = grunt.file.readJSON(options.patternsDir + "/" + patternFile);

            grunt.log.ok("Building pattern " + json.name);

            json.summary = "../../" + options.patternsDir + "/" + path.dirname(patternFile, ".json") + "/summary.html";

            loadPatternScss(patternFile, json, options);
            loadPatternExamples(patternFile, json, options);

            result.push(json);
        });

        return result;
    };

    grunt.registerTask("docs-build", "Creates the documentation.", function() {
        var patterns, options = this.options();

        if (grunt.file.exists(options.patternsDir + '/font/examples/font/zui.html')) {
            grunt.file.copy(
                options.patternsDir + '/font/examples/font/zui.html',
                options.patternsDir + '/font/examples/font/example.html'
            );

            grunt.file.delete(options.patternsDir + '/font/examples/font/zui.html');
        }

        patterns = loadPatterns(options);

        patterns.forEach(function(pattern) {
            pattern.htmlName = pattern.name.toLowerCase().replace(' ', '-');
        });

        patterns.forEach(function(pattern) {
            pattern.htmlName = pattern.name.toLowerCase().replace(' ', '-');
            var destPath = options.dest + "/" + pattern.htmlName + ".html";
            var template = swig.compileFile(options.templatesDir + '/pattern.html');
            var templateVariables = {
                page: {
                    title: pattern.name
                },
                patterns: patterns,
                pattern: pattern
            };

            grunt.file.write(destPath, template(templateVariables));
        });

        grunt.file.recurse(options.pagesDir, function(abspath, rootdir, subdir, filename) {
            var template = swig.compileFile(abspath);
            var content = template({
                page: {},
                patterns: patterns
            });

            grunt.file.write(options.dest + "/" + filename, content);
        });
    });
};
