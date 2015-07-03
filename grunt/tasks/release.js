module.exports = function(grunt) {
    "use strict";

    var shell = require('shelljs');
    var semver = require('semver');

    grunt.registerTask("release", "Creates a new release.", function(type) {
        var pkg = grunt.config.get('pkg');

        switch (type) {
            case 'major':
            case 'minor':
            case 'patch':
                pkg.version = semver.inc(pkg.version, type);
                break;

            default:
                grunt.log.error('Please specify the type of release you want to deploy (e.g. grunt release:minor)');
                return;
        }

        // Make sure that the working tree is clean:
        if (shell.exec('git diff-files --quiet').code !== 0) {
            grunt.log.error('Your working tree contains uncommitted changes. Please commit all your changes.');
            return;
        }

        // Make sure that the index is clean:
        if (shell.exec('git diff-files --quiet').code !== 0) {
            grunt.log.error('Your index contains uncommitted changes. Please commit all your changes.');
            return;
        }

        // We can only continue if the repository type has been set to git:
        if (!pkg.repository.type || pkg.repository.type !== 'git') {
            grunt.log.error('Your package.json has no repository defined or the repository is not a git repository.');
            return;
        }

        if (!grunt.file.exists("dist")) {
            grunt.log.error('No dist folder found so we cannot release.');
            return;
        }

        // Load bower.json and update the JSON:
        var bowerJson = grunt.file.readJSON("bower.json");
        bowerJson.version = pkg.version;

        // Update the package json and bower.json:
        grunt.file.write('package.json', JSON.stringify(pkg, null, 2));
        grunt.file.write('bower.json', JSON.stringify(bowerJson, null, 2));

        // Commit the new package.json
        shell.exec('git add package.json bower.json');
        shell.exec('git commit -m "Set the version to ' + pkg.version + '"');

        // We release from the master:
        shell.exec('git checkout master');
        shell.exec('git checkout -b release/' + pkg.version);

        // Add all generated files and create the tag:
        shell.exec('git add --all --force dist/');
        shell.exec('git commit -m "Added generated files for release ' + pkg.version + '"');
        shell.exec('git tag -a -m "Release ' + pkg.version + '" -f ' + pkg.version);

        // We're done, move back to the master and push:
        shell.exec('git checkout master');
        shell.exec('git branch -D release/' + pkg.version);
    });
};
