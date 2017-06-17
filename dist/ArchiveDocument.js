'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _libxmljs = require('libxmljs');

var _libxmljs2 = _interopRequireDefault(_libxmljs);

var _decoder = require('jpg-stream/decoder');

var _decoder2 = _interopRequireDefault(_decoder);

var _encoder = require('jpg-stream/encoder');

var _encoder2 = _interopRequireDefault(_encoder);

var _mosaicImageStream = require('mosaic-image-stream');

var _mosaicImageStream2 = _interopRequireDefault(_mosaicImageStream);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArchiveDocument = function () {
    function ArchiveDocument(url) {
        _classCallCheck(this, ArchiveDocument);

        var result = ArchiveDocument.extractFifs(url);
        this.fif7 = result[1];
        this.fif5 = result[2];
        this.fif3 = result[3];
        this.fif1 = result[4];
    }

    /**
     * Extract the required parts from the URL
     * @param val
     * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
     */


    _createClass(ArchiveDocument, [{
        key: 'tileUrl',


        /**
         * Build a tile url based on an object with the separate values
         * @param tile
         * @return {string}
         */
        value: function tileUrl(tile) {
            return 'http://search.arch.be/imageserver/getpic.php?' + this.fif1 + '/' + this.fif3 + '/' + this.fif5 + '/' + this.fif7 + '.jp2&' + tile;
        }
    }, {
        key: 'buildTileArrays',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(layer) {
                var streams, pos, row, col, url, res, stream;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                streams = [];
                                pos = layer.starttile;
                                row = 0;

                            case 3:
                                if (!(row < 2 /*layer.rows - 1*/)) {
                                    _context.next = 20;
                                    break;
                                }

                                streams[row] = [];

                                col = 0;

                            case 6:
                                if (!(col < layer.cols)) {
                                    _context.next = 17;
                                    break;
                                }

                                url = this.tileUrl(pos);
                                _context.next = 10;
                                return (0, _nodeFetch2.default)(url);

                            case 10:
                                res = _context.sent;
                                stream = res.body.on('error', function (err) {
                                    return console.error;
                                }).pipe(new _decoder2.default()).on('meta', function (meta) {
                                    return console.log('Meta: ' + JSON.stringify(meta));
                                }).on('finish', function (meta) {
                                    return console.log('Finish: ' + JSON.stringify(meta));
                                });


                                streams[row].push(stream);
                                pos++;

                            case 14:
                                col++;
                                _context.next = 6;
                                break;

                            case 17:
                                row++;
                                _context.next = 3;
                                break;

                            case 20:
                                return _context.abrupt('return', streams);

                            case 21:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function buildTileArrays(_x) {
                return _ref.apply(this, arguments);
            }

            return buildTileArrays;
        }()
    }, {
        key: 'stitchTiles',
        value: function stitchTiles(layer, streams) {
            (0, _mosaicImageStream2.default)(streams, layer.rows * this.tileheight).on('error', console.error).on('finish', function () {
                return console.log('hallo');
            }).pipe(new _encoder2.default()).pipe(fs.createWriteStream(path.join(__dirname, 'testje.jpg')));
            console.log('Written to ' + path.join(__dirname, 'testje.jpg'));
        }
    }, {
        key: 'fetchMeta',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var result, body, xmlDoc;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return (0, _nodeFetch2.default)(this.metaUrl);

                            case 2:
                                result = _context2.sent;
                                _context2.next = 5;
                                return result.text();

                            case 5:
                                body = _context2.sent;
                                xmlDoc = _libxmljs2.default.parseXml(body);

                                // Extract tile dimensions

                                this.tilewidth = parseInt(xmlDoc.get('//tjpinfo/tilewidth').text());
                                this.tileheight = parseInt(xmlDoc.get('//tjpinfo/tileheight').text());

                                // Extract layers
                                this.layers = xmlDoc.get('//layers').find('layer').map(function (layer) {
                                    var obj = {};
                                    ['no', 'starttile', 'cols', 'rows', 'scalefactor', 'width', 'height'].forEach(function (attr) {
                                        obj[attr] = parseInt(layer.attr(attr).value());
                                    });
                                    return obj;
                                });

                            case 10:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchMeta() {
                return _ref2.apply(this, arguments);
            }

            return fetchMeta;
        }()
    }, {
        key: 'metaUrl',


        /**
         * Build a meta url based on an object with the separate values
         * @return {string}
         */
        get: function get() {
            return 'http://search.arch.be/imageserver/topview.xml.php?FIF=' + this.fif1 + '/' + this.fif3 + '/' + this.fif5 + '/' + this.fif7 + '.jp2';
        }
    }], [{
        key: 'extractFifs',
        value: function extractFifs(val) {
            return (/(((([0-9]{3})_[0-9]{4}_[0-9]{3})_[0-9]{5}_[0-9]{3})_[0-9]{1}_[0-9]{4})/.exec(val)
            );
        }
    }]);

    return ArchiveDocument;
}();

exports.default = ArchiveDocument;
//# sourceMappingURL=ArchiveDocument.js.map