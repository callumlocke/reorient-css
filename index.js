var parse = require('url').parse;
var rework = require('rework');

// Based on the POSIX-only version of path.relative() from Node source
function relative(from, to) {
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

// Take the last part off a URL
function dirname(path) {
  var parts = path.split('/');
  parts.pop();
  return parts.join('/');
}

// Resolve "../" in URL paths
function resolve(url) {
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

// Exports
module.exports = function reorientCSS (css, from, to, options) {
  var route = relative(dirname(to), dirname(from));

  return (
    rework(css)
      .use(rework.url(function (url) {
        var parsed = parse(url);

        if (
          route === '' ||
          (url.indexOf('//') === 0) ||
          (parsed.protocol === 'data:') ||
          (parsed.host) ||
          (parsed.pathname.charAt(0) === '/')
        ) {
          return url;
        }

        return resolve(route + '/' + url);
      }))
      .toString(options)
  );
};
