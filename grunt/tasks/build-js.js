module.exports = function( grunt ) {
	"use strict";

    var requirejs = require("requirejs");
    var requirejsConfig = {
        baseUrl: "js",
        name: "zui",
        out: "dist/zui.js",
        optimize: "none",
        findNestedDependencies: true,
        skipModuleInsertion: true,
        skipSemiColonInsertion: true,
        wrap: {
            startFile: ["js/zui/build/intro.js"],
            endFile: ["js/zui/build/outro.js"]
        },
        rawText: {},
        paths: {
            "jquery": "//code.jquery.com/jquery-2.0.0.min.js"
        },
        onBuildWrite: convert
    };

	function convert(name, path, contents) {
		var amdName = grunt.option("amd");

        contents = contents
            .replace(/\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, "$1")
            .replace(/\s*exports\.\w+\s*=\s*\w+;/g, "");
        contents = contents.replace(/define\([^{]*?{/, "").replace(/\}\);[^}\w]*$/, "");
        contents = contents.replace(/define\(\[[^\]]*\]\)[\W\n]+$/, "");

		if (amdName !== null && /^exports\/amd$/.test(name)) {
			if (amdName) {
				grunt.log.writeln("Naming ZUI with AMD name: " + amdName);
			} else {
				grunt.log.writeln("AMD name now anonymous" );
			}

			contents = contents.replace(/(\s*)"jquery"(\,\s*)/, amdName ? "$1\"" + amdName + "\"$2" : "");
		}

		return contents;
	}

	grunt.registerMultiTask("build-js", "Create the zui.js library.", function() {
        var done, version, name = this.data.dest;

		requirejsConfig.out = function( compiled ) {
			compiled = compiled.replace(/@VERSION/g, version);
			compiled = compiled.replace(/@DATE/g, (new Date()).toISOString().replace( /:\d+\.\d+Z$/, "Z" ));

			grunt.file.write(name, compiled);
		};

        version = grunt.config("pkg.version");
		if (process.env.COMMIT) {
			version += " " + process.env.COMMIT;
		}

        done = this.async();
		requirejs.optimize(requirejsConfig, function(response) {
			grunt.verbose.writeln(response);
			grunt.log.ok("File '" + name + "' created.");
			done();
		}, function(err) {
			done(err);
		});
	});
};
