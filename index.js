/*
  reorient-css
  https://github.com/callumlocke/reorient-css

  MIT licence
  Copyright 2014 Callum Locke
*/


// Imports
var path = require('path');
var parse = require('url').parse;
var postcss = require('postcss');


// Regex to find the URLs within a CSS property value
// Fiddle: http://refiddle.com/by/callum-locke/match-multiple-urls-within-a-css-property-value
// Railroad: http://goo.gl/vQzMcg
var urlMatcher = /url\(\s*['"]?([^)'"]+)['"]?\s*\)/g;


// Helpers
function relative(from, to) {
  // this is based on the POSIX-only version of path.relative() from Node source

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

function dirname(path) {
  var parts = path.split('/');
  parts.pop();
  return parts.join('/');
}

function isFileRelativeURL(url) {
  var parsed = parse(url);

  return !(
    (url.indexOf('//') === 0) ||
    (parsed.protocol === 'data:') ||
    (parsed.host) ||
    (parsed.pathname.charAt(0) === '/')
  );
}

function resolve(url) {
  // this normalises any "../" in URL paths
  var parts = url.split('/');

  var newParts = [];
  var started = false;
  parts.forEach(function (part) {
    if (part !== '..') {
      started = true;
      newParts.push(part);
    }
    else {
      if (started) newParts.pop();
      else newParts.push(part);
    }
  });

  return newParts.join('/');
}

function getRoute(to, from) {
  from = from.split('/');
  to   = to.split('/');

  while (from.length && to.length) {
    if (from[0] === to[0]) {
      from.shift();
      to.shift();
    }
    else break;
  }

  from = from.join('/');
  to   = to.join('/');

  var route = relative(dirname(to), dirname(from));

  return route;
}


// Exports
module.exports = function reorientCSS (css, from, to) {
  if (typeof css !== 'string')
    throw new Error('reorient-css: expected "css" argument as a string.');
  if (typeof from !== 'string')
    throw new Error('reorient-css: expected "from" argument to be a string.');
  if (typeof to !== 'string')
    throw new Error('reorient-css: expected "to" argument to be a string.');

  var route = getRoute(to, from);

  if (route === '') return css;

  var htmlToHTML = (
    path.extname(from) === '.html' &&
    path.extname(to) === '.html'
  );

  var reorienter = postcss(function (css) {
    css.eachDecl(function (decl) {
      
      // Skip if this one is a `behavior` property (except if we're relocating
      // from one HTML file to another)
      if (!htmlToHTML) {
        var behaviorIndex = decl.prop.trim().indexOf('behavior');
        if (behaviorIndex === 0 || behaviorIndex === 1) return;
      }

      // Edit URLs
      var oldValue = decl.value;
      var newValue = oldValue.replace(urlMatcher, function(urlFunc, justURL) {
        if (isFileRelativeURL(justURL))
          return urlFunc.replace(justURL, resolve(route + '/' + justURL));

        return urlFunc;
      });

      if (newValue !== oldValue) decl.value = newValue;
    });
  });

  return reorienter.process(css).css;
};
