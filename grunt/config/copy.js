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
                    '<%= paths.docs %>/assets/js/*.js',
                    '<%= paths.dist %>/js/*.js'
                ],
                dest: '<%= paths.docs %>/build/js/',
                filter: 'isFile'
            }
        ]
    }
};
