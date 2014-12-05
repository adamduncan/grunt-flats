/*
 * grunt-flats
 * https://github.com/adamduncan/grunt-flats
 *
 * Copyright (c) 2014 Adam Duncan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    clean: {
      build: '_templates/*.html'
    },

    flats: {
      options: {
        basePath: '_templates',
        src: '_layouts',
        master: '_master/master.html'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['clean', 'flats']);

};
