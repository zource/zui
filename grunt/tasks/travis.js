module.exports = function(grunt) {
    "use strict";

    var shell = require("shelljs");
    var access = 'waltertamboer:' + process.env.GH_TOKEN;

    function createCommitMessage() {
        var ret = '';

        ret += 'Branch: ' + process.env.TRAVIS_BRANCH + ' - ';
        ret += 'SHA: ' + process.env.TRAVIS_COMMIT + ' - ';
        ret += 'Range SHA: ' + process.env.TRAVIS_COMMIT_RANGE + ' - ';
        ret += 'Build ID: ' + process.env.TRAVIS_BUILD_ID + ' - ';
        ret += 'Build number: ' + process.env.TRAVIS_BUILD_NUMBER;

        return ret;
    }

    function createTag() {
        var version = grunt.config("pkg.version");
        var sha1 = shell.exec('git rev-parse HEAD', {silent: true});
        var result = shell.exec('git name-rev --tags --name-only ' + sha1.output.trim(), {silent: true});

        if (version === '0.0.0') {
            version = 'undefined';
        }

        if (result.output.trim() === version) {
            return;
        }

        shell.exec('git tag -a ' + version + ' -m "Version ' + version + '"');
    }

    function publishDocs() {
        var url = 'https://' + access + '@github.com/zource/zui.git';

        if (grunt.file.exists('.grunt/gh-pages')) {
            shell.cd('.grunt/gh-pages');

            shell.exec('git remote rm origin');
            shell.exec('git remote add origin ' + url);

            shell.exec('git pull origin gh-pages');
            shell.cd('../../');
        } else {
            shell.exec('git clone ' + url + ' --branch gh-pages .grunt/gh-pages');
        }

        shell.exec('rm -rf .grunt/gh-pages/*');
        shell.exec('cp -R docs/build/* .grunt/gh-pages/');

        shell.cd('.grunt/gh-pages');
        shell.exec('git add -A');
        shell.exec('git commit -m "' + createCommitMessage() + '"');
        shell.exec('git push -fq origin gh-pages');
    }

    function publishBower() {
        var url = 'https://' + access + '@github.com/zource/zui-bower.git';

        if (grunt.file.exists('.grunt/zui-bower')) {
            shell.cd('.grunt/zui-bower');

            shell.exec('git remote rm origin');
            shell.exec('git remote add origin ' + url);

            shell.exec('git pull origin master');
            shell.cd('../../');
        } else {
            shell.exec('git clone ' + url + ' --branch master .grunt/zui-bower');
        }

        shell.exec('rm -rf .grunt/zui-bower/*');
        shell.exec('cp -R build/* .grunt/zui-bower/');

        shell.cd('.grunt/zui-bower');
        shell.exec('git fetch');
        shell.exec('git add -A');

        createTag();

        shell.exec('git commit -m "New build made by Travis CI."');
        shell.exec('git push -fq origin master');
        shell.exec('git push -fq origin --tags');
    }

    grunt.registerTask("travis", "Executed after a successful Travis CI build.", function(type) {
        if (process.env.TRAVIS !== "true") {
            grunt.log.error("No Travis CI environment available.");
            return;
        }

        if (process.env.TRAVIS_BRANCH !== "master") {
            grunt.log.warn("Ignoring release for branch " + process.env.TRAVIS_BRANCH + ". Only master is accepted.");
            return;
        }

        switch (type) {
            case "docs":
                publishDocs();
                break;

            case "bower":
                publishBower();
                break;

            default:
                grunt.log.error("Invalid process type provided.");
                break;
        }
    });
};
