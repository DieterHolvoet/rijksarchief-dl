#! /usr/bin/env node
'use strict';

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ArchiveDocument = require('./ArchiveDocument');

var _ArchiveDocument2 = _interopRequireDefault(_ArchiveDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('1.0').option('-u, --url [url]', 'The url of the resource').parse(process.argv);

if (_commander2.default.url) {
    var doc = new _ArchiveDocument2.default(_commander2.default.url);
    doc.fetchMeta().then(function () {
        var selectedLayer = doc.layers[doc.layers.length - 1];
        console.log(JSON.stringify(selectedLayer));
        return doc.mosaics(selectedLayer);
    }
    /*.then((streams) => {
        doc.stitchTiles(doc.layers[doc.layers.length - 1], streams);
    });*/
    );
}
//# sourceMappingURL=main.js.map