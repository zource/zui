// https://github.com/tschaub/grunt-gh-pages
module.exports = {
    options: {
        branch: 'gh-pages',
        base: 'docs/build/'
    },
    publish: {
        options: {
            repo: 'https://github.com/zource/zui.git',
            message: 'publish gh-pages (cli)'
        },
        src: ['**']
    },
    'travis-docs': {
        options: {
            user: {
                name: 'Walter Tamboer',
                email: 'walter@tamboer.nl'
            },
            repo: 'https://' + process.env.GH_TOKEN + '@github.com/zource/zui.git',
            message: 'Publishing documentation...' + (function getDeployMessage() {
                var ret = '\n\n';

                if (process.env.TRAVIS !== 'true') {
                    ret += 'Missing environment variables for Travis CI.';
                    return ret;
                }

                ret += 'Branch: ' + process.env.TRAVIS_BRANCH + '\n';
                ret += 'SHA: ' + process.env.TRAVIS_COMMIT + '\n';
                ret += 'Range SHA: ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
                ret += 'Build ID: ' + process.env.TRAVIS_BUILD_ID + '\n';
                ret += 'Build number: ' + process.env.TRAVIS_BUILD_NUMBER + '\n';
                return ret;
            })(),
            silent: true
        },
        src: ['**']
    }
};
