# reorient-css [![Build Status](https://secure.travis-ci.org/callumlocke/reorient-css.png?branch=master)](http://travis-ci.org/callumlocke/reorient-css)

> Updates relative asset URLs (`url(...)`) within a string of CSS to reflect a relocation of the CSS file.
> Example: when programatically inlining CSS from `styles/main.css` into a `<style>` element in `index.html`, you can use this function to rewrite all the image/font URLs within the CSS so they still work.


## Getting Started

`npm install reorient-css`

```javascript
var reorientCSS = require('reorient-css');

var newCSS = reorientCSS(
  'body { background: url(something.png); }', // css string
  'some/old/stylesheet/file.css',             // old css file location
  'some/new/one.css'                          // new css file location
);

console.log(newCSS);
// > body { background: url('../old/stylesheet/something.png'); }
```

**Notes**

- This takes in a string of CSS, not a file.
- It does not care whether the old/new paths actually exist anywhere, it just uses them to determine the path from the new base to the old base, so it can use this to update the asset URLs.
- Root-relative, absolute and `data:` asset URLs will be left alone, as these are expected to work the same regardless of the CSS file's location. Only file-relative URLs are changed.
- Whitespace/formatting will not be maintained. The resulting CSS is whatever comes out of [rework](https://github.com/reworkcss/rework)'s [`toString` method](https://github.com/reworkcss/rework#reworktostringoptions), which is indented with spaces. You can optionally pass an object as a 4th argument, which will be passed through to rework's `toString` method (eg, `{compress: true}` to strip whitespace). But for best results, run the CSS through a proper minifier after reorienting, to get rid of unnecessary quotes, semicolons, etc.

## License
Copyright (c) 2014 Callum Locke. Licensed under the MIT license.
