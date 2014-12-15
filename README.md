
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

**Note:** _Grunt-flats_ includes [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean) as a dependency, and will clean all `*.html` files from this directory on build (excluding `masterSrc`, should you want to keep that in the `basePath` directory).

## File structure

_Grunt-flats_ attempts to be as flexible as possible. The file structure based off the tasks' default options would follow:

```
_templates/
  
  masterpage/
    master.html
  
  layouts/
    (individual layout templates)
  
  partials/
    (partials and/or user-defined sub-directories)

  (compiled templates)
```

However, each of these directories and paths are configurable to match your existing workflow. If you're a fan of Pattern Lab's [Atomic Design Patterns](http://patternlab.io/docs/pattern-organization.html) or Lonely Planet's [Rizzo Styleguide](http://rizzo.lonelyplanet.com/styleguide) you can folderize your partials accordingly.

The _grunt-flats_ Git repo contains an example `_templates` directory. This includes a master, layouts and partials to demonstrate how the plugin could be utilised.

It is especially effective when wanting to produce a **living styleguide** for a site; ensuring all code snippets are maintained in a single place and any changes are automatically propogated through all templates.

### Master page

_See: [/_templates/masterpage/master.html](https://github.com/adamduncan/grunt-flats/blob/master/_templates/masterpage/master.html)_

The master should contain all of your site-wide template markup. It contains a single `{{>content}}` partial to act as a placeholder; this is where each individual layout's markup will be rendered.

## Partials/include pattern

_Grunt-flats_ uses [Hogan.js](http://twitter.github.io/hogan.js/) under the hood. It's built against [Mustache](http://mustache.github.io/mustache.5.html)'s test suite, so you can easily port your existing Mustache or Handlebars templates and retain the same partial syntax.

To include a partial, reference it using an extensionless path. This should be relative to the `options.partialPath` directory. E.g.

```
{{>components/header}}
```

Partials are constructed recursively, so can be infinitely nestable.

### Partial-specific data

Partial rendering can be enhanced by including a partial-specific data object. This syntax is similar to that utilised by [Pattern Lab](http://patternlab.io/docs/pattern-parameters.html):

```
{{>components/module-promo ("imgsrc": "/images/new-promo.jpg", "title": "New Module Title")}}
```

Partial data is wrapped within parenthesis `( ... )` and appended to the partial reference. Within, the data should be formatted as you would any standard JSON object. Keys and values are wrapped in double quotes, and each key/value pair separated by a single comma.

### Partial default values

Once a data object has been defined and passed to a partial, we can utilise these values on their own, or pair them with defaults. Use Mustache's [Inverted Sections syntax](https://github.com/janl/mustache.js/#inverted-sections) to declare a default value to use, following a standard Mustache [Variable](https://github.com/janl/mustache.js/#variables). For example, within _components/module-promo_:

```html
<img src="{{imgsrc}}{{^imgsrc}}/images/default-promo-image.jpg{{/imgsrc}}" alt="Placeholder" />
<h2>{{title}}{{^title}}Default Module Title{{/title}}</h2>
```

This way we can define default dummy data for any partials throughout the templates, and be sure only one value will be rendered. It allows our partials to be more customisable and re-usable, in a very targetted way.  

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- v0.1.0 Initial setup, non-recursive partial rendering
- v0.2.0 Rewrite to support infinitely nestable partial rendering
- v0.2.1 Added error checking for incorrect/missing partials 
- v0.3.0 Added partial-specific data rendering