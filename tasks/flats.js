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

		// Store partial, layout paths and global layouts object
		var partialPath = options.basePath + '/' + options.partialPath,
			layoutPath = options.basePath + '/' + options.layoutPath,
			layouts = {};


		var layoutLoop = function (path) {
			
			// Recurse through layouts directory
			grunt.file.recurse(path, function (absPath, rootDir, subDir, filename) {

			// Read layout source
				var layoutSource = grunt.file.read(absPath);

				// Add record to global layouts object
				layouts[filename] = layoutSource;

				// Make call to kick off partial recursion
				partialLoop(absPath, filename);
			
			});

			// Recurse function completed without failing, render layout html
			renderLayouts();
		
		};

		var partialLoop = function(absPath, filename) {

			// Store partials and bool
			var partialSource = grunt.file.read(absPath),
				partials = partialSource.match(/{{>.*}}/g),
				containsPartial = !!(partials);

			// Check if layout contains more partials
			if (!containsPartial) {
				// No? Exit early
				return;
			} else {
				// Yes? Make call to process partials recursively
				partialWrite(partials, filename);
			}

		};

		var partialWrite = function (partials, filename) {

			// Loop through each partial found
			each(partials, function(partial) {

				// Store copy of partial string for augmentation and data regex
				var partialString = partial,
					partialDataReg = partialString.match(/\(.*\)/g);
				
				// Check if partial contains data object - ie. (...) 
				if (partialDataReg) {
					// Store data as string and object
					var partialDataString = partialDataReg[0],
						partialDataObj = JSON.parse('{' + partialDataString.substring(1, partialDataString.length - 1) + '}');

					// Remove partial data from copy of partial string
					partialString = partialString.replace(partialDataString, '');
					
				}

				// Store partial paths and source
				// Use grunt.expand method, passing partial path, with extension wildcard, pattern
				var partialRelPath = partialString.split('{{>')[1].split('}}')[0].trim(),
					partialAbsPath = grunt.file.expand(partialPath + '/' + partialRelPath + '.*');

				// Make sure partial exists before compiling
				if (partialAbsPath == "") {
					// Log error and fail with warning
					grunt.fail.warn('Cannot find ' + options.partialPath + '/' + partialRelPath + ' in ' + filename +
									'.\nPlease ensure path/filename is correct and has no extension');

				} else {

					// Store partial source, compiled template
					var partialSource = grunt.file.read(partialAbsPath),
						compilePartial = hogan.compile(partialSource),
						newSource;						

					// If data object was found earlier
					if (partialDataObj) {
						// Generate new source by replacing original partial with data-compiled partial render
						newSource = layouts[filename].replace(partial, compilePartial.render(partialDataObj));
					} else {
						// Render partial as is by replacing in source
						newSource = layouts[filename].replace(partial, partialSource);
					}

					// Update value in global layouts object
					layouts[filename] = newSource;

					// Recurse, passing nested partials and layout filename
					partialLoop(partialAbsPath, filename);

				}

			});

		};


		// Generate all layouts once layouts global object compiled
		var renderLayouts = function() {

			grunt.log.writeln('\nGenerating layouts:');

			each(layouts, function (layout, name) {

				// Pull layout into master content placeholder partial
				layouts.content = layout;

				// Render final layout
				layout = master.render({}, layouts);
				
				// Change layout extension to html
				name.replace(name.substring(name.lastIndexOf('.')), '.html');
				
				// Write file to working directory
				var layoutSrc = options.destPath  + '/' + name;
				grunt.file.write(layoutSrc, layout);
				
				// Log each template successfully rendered/written
				grunt.log.ok(layoutSrc);
			
			});

		};


		// Call to loop over layouts
		layoutLoop(layoutPath);



		// Each helper
		function each(obj, iter) {
			var keys = Object.keys(obj);
			for (var i = 0; i < keys.length; i++) {
				iter.call(null, obj[keys[i]], keys[i]);
			}
		}

	});

};
