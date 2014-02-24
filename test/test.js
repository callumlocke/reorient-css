/*global describe, it, before*/

var expect = require('chai').expect;
var reorientCSS = require('..');

describe('reorientCSS', function() {
  var css;
  before(function () {
    css = require('fs').readFileSync(require('path').join(__dirname, 'fixtures', 'sample.css')).toString();
  });
  
  it('works when moving up directories', function () {
    var result = reorientCSS(css, 'styles/foo/main.css', 'index.html', {compress: true});

    expect(result).to.equal(
      'p{background:url("styles/foo/foo/bar/wow.png");}' +
      'p{background:url("/foo/bar/wow.png");}' +
      'p{background:url("http://example.com/foo/bar/wow.png");}' +
      'p{background:url("styles/phone/football.png");}'
    );
  });

  it('works when staying at the same level', function () {
    var result = reorientCSS(css, 'styles/main.css', 'styles/other.css', {compress: true});

    expect(result).to.equal(
      'p{background:url("foo/bar/wow.png");}' +
      'p{background:url("/foo/bar/wow.png");}' +
      'p{background:url("http://example.com/foo/bar/wow.png");}' +
      'p{background:url("../phone/football.png");}'
    );
  });

  it('works when going deeper', function () {
    var result = reorientCSS(css, 'styles/main.css', 'styles/foo/bar/other.html', {compress: true});

    expect(result).to.equal(
      'p{background:url("../../foo/bar/wow.png");}' +
      'p{background:url("/foo/bar/wow.png");}' +
      'p{background:url("http://example.com/foo/bar/wow.png");}' +
      'p{background:url("../../../phone/football.png");}'
    );
  });
});
