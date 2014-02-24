# reorient-css [![Build Status](https://secure.travis-ci.org/callumlocke/reorient-css.png?branch=master)](http://travis-ci.org/callumlocke/reorient-css)

> Updates relative asset URLs (ie, `url(something.png)`) within a string of CSS to reflect a relocation of the CSS file.

**Example use case:** if you were inlining CSS from `styles/main.css` into a `<style>` element in `index.html` (as part of a build task aiming to reduce HTTP round trips), you could use this function to rewrite all the image/font URLs within the CSS so they still work from the new relative base – in this example, it would prepend all file-relative URLs with `style/`.


## Getting Started

`npm install reorient-css`

```javascript
var reorientCSS = require('reorient-css');

var newCSS = reorientCSS(
  'body { background: url(something.png); }', // css string
  'some/old/stylesheet/file.css',             // old css location
  'some/new/one.css'                          // new css location (this could even be an .html file, if you're
                                              // inlining the CSS into a <style> element)
);

console.log(newCSS);
// > body { background: url('../old/stylesheet/something.png'); }
```

**Notes**

- You need to pass a string of CSS as the first argument.
- It does not care whether the old/new paths actually exist anywhere, it just uses them to determine the relative path from the new location back to the old location, so it can know how to rewrite the asset URLs.
- Only file-relative URLs are rewritten. Root-relative, absolute and `data:` URLs will be left untouched, as these are expected to work the same regardless of the CSS file's location.
- `behavior` properties (a proprietary IE thing) will be left untouched, because any URLs in these properties are relative to the HTML document, not the CSS file, so in theory they should never change.
  - The only exception is if you are moving CSS from one HTML document to another (ie, in &lt;style&gt; elements). If both the new and old CSS locations you provide are `.html` files, `behavior` properties **will** be reoriented.
- Whitespace and formatting are left untouched.

## License
Copyright (c) 2014 Callum Locke. Licensed under the MIT license.
