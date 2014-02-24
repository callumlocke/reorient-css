# reorient-css [![Build Status](https://secure.travis-ci.org/callumlocke/reorient-css.png?branch=master)](http://travis-ci.org/callumlocke/reorient-css)

> Rewrites all `url()` assets within a string of CSS to reflect a change of location of the CSS file.
> Example: when programatically inlining CSS from `styles/main.css` into a `<style>` element in `index.html`, you can use this function to rewrite all the image/font URLs within the CSS so they still work.


## Getting Started

`npm install reorient-css`

```javascript
var reorientCSS = require('reorient-css');

var newCSS = reorientCSS(
  'body { background: url('something.png'); }',
  'some/old/stylesheet/file.css',
  'some/new/one.css'
);

console.log(newCSS);
// > body { background: url('../old/stylesheet/something.png'); }
```

NB. whitespace/formatting will not necessarily be maintained. You can optionally pass an object as a 4th argument, which will be passed to [rework's `toString` method](https://github.com/reworkcss/rework#reworktostringoptions) (eg, `{compress: true}`). But for best results, run the results through a proper minifier after reorienting.

## License
Copyright (c) 2014 Callum Locke. Licensed under the MIT license.
