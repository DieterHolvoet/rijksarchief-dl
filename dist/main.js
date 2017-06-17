#! /usr/bin/env node
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ArchiveDocument = require('./ArchiveDocument');

var _ArchiveDocument2 = _interopRequireDefault(_ArchiveDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildArrays(fifs, layer) {
    var urls = [];
    var size = [layer.width, layer.height];

    var factories = Array(size[0]).fill().map(function (v, i) {
        var count = 0;
        return function (cb) {
            var values = _extends({}, fifs, { tile: 1 });
            var url = urls[count + i * size[1]];
            if (++count > size[1]) return cb(null, null);
            cb(null, request(url).pipe(new JPEGDecoder()));
        };
    });
}

_commander2.default.version('1.0').option('-u, --url [url]', 'The url of the resource').parse(process.argv);

if (_commander2.default.url) {
    var doc = new _ArchiveDocument2.default(_commander2.default.url);
    doc.fetchMeta().then(function () {
        console.log('Longest part: ' + doc.fif3);
        console.log('Shorter part: ' + doc.fif5);
        console.log('Shortest part: ' + doc.fif7);

        var selectedLayer = doc.layers[doc.layers.length - 1];
        console.log(JSON.stringify(selectedLayer));
    });
}