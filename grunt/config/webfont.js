// https://github.com/sapegin/grunt-webfont
module.exports = {
    dist: {
        src: 'svg/*.svg',
        dest: '<%= paths.dist %>/fonts',
        destCss: 'scss/zui/patterns/font/',
        options: {
            destHtml: 'docs/patterns/font/examples/font/',
            engine: 'node',
            font: 'zui',
            htmlDemo: true,
            htmlDemoTemplate: 'grunt/templates/webfont/zui.html',
            ligatures: false,
            relativeFontPath: '../fonts/',
            stylesheet: 'scss',
            template: 'grunt/templates/webfont/zui.scss',
            types: 'eot,woff,ttf,svg'
        }
    }
};
