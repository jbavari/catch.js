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
    },
    jasmine: {
      tests: {
        src: 'js/*.js',
        options: {
          specs: 'spec/*.js',
          helpers: 'spec/*Helper.js'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        runnerPort: 9999,
        singleRun: true
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);
};