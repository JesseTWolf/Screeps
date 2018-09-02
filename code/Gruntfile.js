module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: [
          'src/utils/**/*.js',
          'src/abstract/**/*.js',
          'src/creeps/*.js',
          'src/creeps/roles/**/*.js',
          'src/room/**/*.js',
          'src/Config.js',
          'src/main.js'
        ],
        dest: '../main2.js'
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['concat']
      },
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('default', ['concat', 'watch'])

};
