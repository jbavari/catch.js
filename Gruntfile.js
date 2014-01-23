module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['js/**/*.js', 'spec/*.js'],
      options: {
        smarttabs: true,
        eqnull: true,
        eqeqeq: false,
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    uglify: {
      min: {
        files: {
          'js/catch.min.js': ['js/ajaxpect.js', 'js/ErrorHandler.js']
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);
};