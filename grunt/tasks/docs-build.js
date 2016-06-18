module.exports = function (grunt) {
    var swig = require('swig');
    var path = require('path');
    var hljs = require('highlight.js');

    var highlightCallback = function (input, idx) {
        return '<div class="code-container"><pre><code lang="html">'
            + hljs.highlight('html', input).value
            + '</code></pre></div>';
    };
    highlightCallback.safe = true;

    swig.setFilter("highlight", highlightCallback);

    var loadFileContent = function (tpl) {
        if (grunt.file.exists(tpl)) {
            return grunt.file.read(tpl);
        }

        return '';
    };

    var loadPatternExamples = function (patternFile, json, options) {
        json.exampleData = {};

        if (json.examples) {
            json.examples.forEach(function (example) {
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

    var loadScssFile = function (scssPath, json) {
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

    var loadScssData = function (options) {
        var result = {
            functions: [],
            mixins: [],
            variables: []
        };

        var strCmp = function (lft, rgt) {
            var str1 = lft.context.name;
            var str2 = rgt.context.name;

            return str1 == str2 ? 0 : (str1 > str2 ? 1 : -1);
        };

        var files = grunt.file.expand({
            "cwd": options.scssDir
        }, [
            "**/*.json"
        ]);

        files.forEach(function (file) {
            var json = {}, sass = loadScssFile(options.scssDir + "/" + file, json);

            if (json.sass.functions) {
                result.functions = result.functions.concat(json.sass.functions);
            }

            if (json.sass.mixins) {
                result.mixins = result.mixins.concat(json.sass.mixins);
            }

            if (json.sass.variables) {
                result.variables = result.variables.concat(json.sass.variables);
            }
        });

        result.functions.sort(strCmp);
        result.mixins.sort(strCmp);
        result.variables.sort(strCmp);

        return result;
    };

    var loadPatternScss = function (patternFile, json, options) {
        var scssPath = options.scssDir + "/" + path.dirname(patternFile) + ".json";

        loadScssFile(scssPath, json);
    };

    var loadPatterns = function (options) {
        var result = [];
        var patternFiles = grunt.file.expand({
            "cwd": options.patternsDir
        }, [
            "**/pattern.json"
        ]);

        patternFiles.forEach(function (patternFile) {
            var json = grunt.file.readJSON(options.patternsDir + "/" + patternFile);

            grunt.log.ok("Building pattern " + json.name);

            json.summary = "../../" + options.patternsDir + "/" + path.dirname(patternFile, ".json") + "/summary.html";

            loadPatternScss(patternFile, json, options);
            loadPatternExamples(patternFile, json, options);

            result.push(json);
        });

        return result;
    };

    grunt.registerTask("docs-build", "Creates the documentation.", function () {
        var patterns, options = this.options();

        if (grunt.file.exists(options.patternsDir + '/font/examples/font/zui.html')) {
            grunt.file.copy(
                options.patternsDir + '/font/examples/font/zui.html',
                options.patternsDir + '/font/examples/font/example.html'
            );

            grunt.file.delete(options.patternsDir + '/font/examples/font/zui.html');
        }

        var sassData = loadScssData(options);

        patterns = loadPatterns(options);

        patterns.forEach(function (pattern) {
            pattern.htmlName = pattern.name.toLowerCase().replace(' ', '-');
        });

        var templatePattern = swig.compileFile(options.templatesDir + '/pattern.html');
        patterns.forEach(function (pattern) {
            pattern.htmlName = pattern.name.toLowerCase().replace(' ', '-');
            var destPath = options.dest + "/" + pattern.htmlName + ".html";
            var templateVariables = {
                page: {
                    title: pattern.name
                },
                patterns: patterns,
                pattern: pattern
            };

            grunt.file.write(destPath, templatePattern(templateVariables));
        });

        grunt.file.recurse(options.pagesDir, function (abspath, rootdir, subdir, filename) {
            var template = swig.compileFile(abspath);
            var content = template({
                page: {},
                patterns: patterns,
                sassFunctions: sassData.functions,
                sassMixins: sassData.mixins,
                sassVariables: sassData.variables
            });

            grunt.log.ok("Building page " + filename);
            grunt.file.write(options.dest + "/" + filename, content);
        });
    });
};
