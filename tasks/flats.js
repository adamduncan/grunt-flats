/*
 * grunt-flats
 * https://github.com/adamduncan/grunt-flats
 *
 * Copyright (c) 2014 Adam Duncan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // External dependencies
  var fs = require('fs'),
      hogan = require('hogan.js');

  // Register task
  grunt.registerMultiTask('flats', 'Grunt task for generating static layouts from templated partials.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        basePath: '_templates',
        src: '_layouts',
        master: '_master/master.html',
        dest: '_templates'
    });

  });

};
