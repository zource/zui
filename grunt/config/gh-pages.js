// https://github.com/tschaub/grunt-gh-pages
module.exports = {
    'gh-pages': {
        options: {
            base: 'docs/build/'
        },
        src: ['**']
    }
};
