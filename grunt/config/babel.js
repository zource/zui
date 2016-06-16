// https://github.com/babel/grunt-babel
module.exports = {
    options: {
        sourceMap: true,
        presets: [
            'es2015'
        ]
    },
    dist: {
        files: {
            'dist/app.js': 'js/zui.js'
        }
    }
};
