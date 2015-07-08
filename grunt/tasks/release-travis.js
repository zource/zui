module.exports = function(grunt) {
    "use strict";

    var shell = require('shelljs');

    grunt.registerTask("release-travis", "Lets Travis CI create a release.", function(type) {
        if (process.env.TRAVIS !== 'true') {
            grunt.log.error("No Travis CI environment available.");
            return;
        }

        shell.exec('git clone https://waltertamboer:${GH_TOKEN}@github.com/zource/zui-bower.git zui-bower');
        shell.exec('rm -rf zui-bower/*');
        shell.exec('cp -r build/* zui-bower/');
        shell.exec('cd zui-bower');
        shell.exec('git remote rm origin');
        shell.exec('git remote add origin https://waltertamboer:${GH_TOKEN}@github.com/zource/zui-bower.git');
        shell.exec('git add -A');
        shell.exec('ZUI_VER=$(git diff bower.json | grep version | cut -d\':\' -f2 | cut -d\'"\' -f2 | sort -g -r | head -1) && if [ $(echo $ZUI_VER | wc -m | tr -d \' \') = \'1\' ]; then echo \'The version number did not change.\'; else git tag -a $ZUI_VER -m "Version $ZUI_VER"; fi');
        shell.exec('git commit -m "New build made by Travis CI."');
        shell.exec('git push -fq origin master');
        shell.exec('git push -fq origin --tags');
        shell.exec('echo -e "Published the library to bower.\n"');
    });
};
