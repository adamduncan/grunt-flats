
# grunt-flats

> Grunt task for generating static pages from templated partials.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-flats --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-flats');
```

## The "flats" task

### Overview
In your project's Gruntfile, add a section named `flats` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
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
```

### Options

#### options.basePath
Type: `String`
Default value: `'_templates'`

Working path for all templating, relative to root

#### options.layoutPath
Type: `String`
Default value: `'layouts'`

Directory where individual layouts are kept, relative to `basePath`

#### options.partialPath
Type: `String`
Default value: `'partials'`

Directory where individual partials are kept, relative to `basePath`

#### options.masterSrc
Type: `String`
Default value: `'masterpage/master.html'`

Path to masterpage, relative to `basePath`

#### options.destPath
Type: `String`
Default value: `'_templates'`

Directory where individual layouts are compiled to, same as `basePath` by default

*Note:* Grunt-flats includes [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean) as a dependency, and will clean all `*.html` files from this directory on build (excluding `masterSrc`, should you want to keep that in the `basePath` directory).

## File structure

Grunt-flats attempts to be as flexible as possible. The file structure based off the tasks' default options would follow:

```
_templates/
  masterpage/
    master.html
  layouts/
    _individual layout templates_
  partials/
    _partials and/or user-defined subdirectories_

_compiled templates_
```

However, each of these directories and paths are configurable to match your existing workflow. If you're a fan of Pattern Lab's [Atomic Design Patterns](http://patternlab.io/docs/pattern-organization.html) or Lonely Planet's [Rizzo Styleguide](http://rizzo.lonelyplanet.com/styleguide) you can folderize your partials accordingly.

### Master page

_See: [/_templates/masterpage/master.html](https://github.com/adamduncan/grunt-flats/blob/master/_templates/masterpage/master.html)_

The master should contain all of your site-wide template markup. It contains a single `{{>content}}` partial to act as a placeholder; this is where each individual layout's markup will be rendered.

## Partials/include pattern

Grunt-flats uses [Hogan.js](http://twitter.github.io/hogan.js/) under the hood. It's built against [Mustache](http://mustache.github.io/mustache.5.html)'s test suite, so you can easily port your existing Mustache or Handlebars templates and retain the same partial syntax.

To include a partial, reference it using an extensionless path. This should be relative to the `options.partialPath` directory. E.g.

```
{{>components/header}}
```

Partials are constructed recursively, so can be infinitely nestable.

_Version 0.3.0 will include a method for passing in a partial-specific data object to render dynamic values. This will be documented as released._


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- v0.1.0 Initial setup, non-recursive partial rendering
- v0.2.0 Rewrite to support infinitely nestable partial rendering
- v0.2.1 Added error checking for incorrect/missing partials