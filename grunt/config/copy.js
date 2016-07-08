// Custom build task
module.exports = {
    docs: {
        files: [
            {
                expand: true,
                flatten: true,
                src: [
                    '<%= paths.dist %>/fonts/*'
                ],
                dest: '<%= paths.docs %>/build/fonts/',
                filter: 'isFile'
            },
            {
                expand: true,
                flatten: true,
                src: [
                    '<%= paths.docs %>/assets/img/*'
                ],
                dest: '<%= paths.docs %>/build/img/',
                filter: 'isFile'
            },
            {
                expand: true,
                flatten: true,
                src: [
                    '<%= paths.docs %>/assets/img/avatars/*'
                ],
                dest: '<%= paths.docs %>/build/img/avatars/',
                filter: 'isFile'
            },
            {
                expand: true,
                flatten: true,
                src: [
                    '<%= paths.vendor %>/jquery/dist/jquery.min.js',
                    '<%= paths.vendor %>/moment/min/moment.min.js',
                    '<%= paths.vendor %>/select2/dist/js/select2.min.js',
                    '<%= paths.docs %>/assets/js/*.js',
                    '<%= paths.dist %>/js/*.js'
                ],
                dest: '<%= paths.docs %>/build/js/',
                filter: 'isFile'
            }
        ]
    },
    build: {
        files: [
            {
                src: ['bower.json'],
                dest: '<%= paths.build %>/'
            },
            {
                expand: true,
                flatten: false,
                src: [
                    '<%= paths.scss %>/**/*.scss'
                ],
                dest: '<%= paths.build %>/',
                filter: 'isFile'
            }
        ]
    }
};
