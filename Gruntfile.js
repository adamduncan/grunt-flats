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

    // grunt-contrib-clean
    // Remove generated templates from destination folder
    // Be sure not to remove master template if saved in base directory
    clean: {
      build: ['<%= flats.build.destPath %>/*.html', '!<%= flats.build.basePath %>/<%= flats.build.masterSrc %>']
    },

    // grunt-flats
    flats: {
      build: {
        options: {
          basePath: '_templates',
          layoutPath: 'layouts',
          partialPath: 'partials',
          masterSrc: 'masterpage/master.html',
          destPath: '_templates'
        }
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
