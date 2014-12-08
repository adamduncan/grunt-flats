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

		// Merge options with defaults
		var options = this.options({
				basePath: '_templates',
				layoutPath: 'layouts',
				partialPath: 'partials',
				masterSrc: 'masterpage/master.html',
				destPath: '_templates'
		});


		// Store masterpage and compiled masterpage
		var masterPath = options.basePath + '/' + options.masterSrc,
				masterSource = grunt.file.read(masterPath),
				master = hogan.compile(masterSource, { sectionTags: [{o:'_i', c:'i'}] });

		// Store partial and layout paths
		var partialPath = options.basePath + '/' + options.partialPath,
				layoutPath = options.basePath + '/' + options.layoutPath;


		// Partial/layout generator function
		var generate = function (path, partials) {

			// Store layouts object
			var layouts = {};

			// Loop through partials/layouts recursively
			grunt.file.recurse(path, function (absPath, rootDir, subDir, filename) {
			
				var layoutSource = grunt.file.read(absPath),
						layout = hogan.compile(layoutSource);

				// Create extensionless partial path
				var relPath  = absPath.substr(rootDir.length + 1),
						layoutName = relPath.substr(0, relPath.lastIndexOf('.'));
				

				//
				// TO-DO: Check for partial-specific data
				//

				// Add rendered layout to layouts object
				layouts[layoutName] = layout.render({}, partials);

				//grunt.log.writeln(tempSrc);
				grunt.log.writeln(JSON.stringify(layouts));

			});

			return layouts;

		};


		// Log start
		//grunt.log.writeln('\nGenerating layouts:');

		// Generate layouts
		var partials = generate(partialPath),
				layouts = generate(layoutPath, partials);

		// Loop over each layout and render/write file
		each(layouts, function (layout, name) {
			partials.content = layout;
			// Render final layout
			layout = master.render({}, partials);
			// Write file to working directory
			var layoutSrc = options.destPath  + '/' + name + '.html';
			grunt.file.write(layoutSrc, layout);
			// Log success
			//grunt.log.writeln(layoutSrc);
		});


		// Each helper
		function each(obj, iter) {
			var keys = Object.keys(obj);
			for (var i= 0; i < keys.length; i++) {
				iter.call(null, obj[keys[i]], keys[i]);
			}
		}

	});

};
