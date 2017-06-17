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

var _mergeImages = require('merge-images');

var _mergeImages2 = _interopRequireDefault(_mergeImages);

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fileBase = require('file-base64');

var base64 = _interopRequireWildcard(_fileBase);

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
        key: 'buildImage',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(layer) {
                var pos, tiles, row, col, url, response, buffer;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                pos = layer.starttile;
                                tiles = [];
                                row = 0;

                            case 3:
                                if (!(row < 2 /*layer.rows - 1*/)) {
                                    _context.next = 22;
                                    break;
                                }

                                col = 0;

                            case 5:
                                if (!(col < layer.cols)) {
                                    _context.next = 19;
                                    break;
                                }

                                url = this.tileUrl(pos);

                                // Fetch image

                                _context.next = 9;
                                return (0, _nodeFetch2.default)(url);

                            case 9:
                                response = _context.sent;
                                _context.next = 12;
                                return response.buffer();

                            case 12:
                                buffer = _context.sent;


                                tiles.push({
                                    x: row * this.tilewidth,
                                    y: col * this.tileheight,
                                    src: buffer
                                });

                                fs.writeFile(path.join(__dirname, row + '-' + col + '-image.jpg'), buffer, "binary", function (err) {
                                    console.log(err);
                                });

                                pos++;

                            case 16:
                                col++;
                                _context.next = 5;
                                break;

                            case 19:
                                row++;
                                _context.next = 3;
                                break;

                            case 22:
                                _context.t0 = base64;
                                _context.next = 25;
                                return (0, _mergeImages2.default)(tiles, { Canvas: _canvas2.default });

                            case 25:
                                _context.t1 = _context.sent;
                                _context.t2 = path.join(__dirname, 'image.jpg');

                                _context.t3 = function (err, output) {
                                    console.log('success');
                                    console.log(err, output);
                                };

                                _context.t0.decode.call(_context.t0, _context.t1, _context.t2, _context.t3);

                            case 29:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function buildImage(_x) {
                return _ref.apply(this, arguments);
            }

            return buildImage;
        }()
    }, {
        key: 'buildTileArrays',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(layer) {
                var streams, pos, row, col, url, res, stream;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                streams = [];
                                pos = layer.starttile;
                                row = 0;

                            case 3:
                                if (!(row < 2 /*layer.rows - 1*/)) {
                                    _context2.next = 20;
                                    break;
                                }

                                streams[row] = [];

                                col = 0;

                            case 6:
                                if (!(col < layer.cols)) {
                                    _context2.next = 17;
                                    break;
                                }

                                url = this.tileUrl(pos);
                                _context2.next = 10;
                                return (0, _nodeFetch2.default)(url);

                            case 10:
                                res = _context2.sent;
                                stream = res.body.on('error', function (err) {
                                    return console.error;
                                }).pipe(new _decoder2.default());


                                streams[row].push(stream);
                                pos++;

                            case 14:
                                col++;
                                _context2.next = 6;
                                break;

                            case 17:
                                row++;
                                _context2.next = 3;
                                break;

                            case 20:
                                return _context2.abrupt('return', streams);

                            case 21:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function buildTileArrays(_x2) {
                return _ref2.apply(this, arguments);
            }

            return buildTileArrays;
        }()
    }, {
        key: 'stitchTiles',
        value: function stitchTiles(layer, streams) {
            (0, _mosaicImageStream2.default)(streams, layer.rows * this.tileheight
            /*.on('error', console.error)
            .on('finish', () => console.log('hallo'))
            .on('close', () => console.log('hallos'))*/
            ).pipe(new _encoder2.default()).pipe(fs.createWriteStream(path.join(__dirname, 'testje.jpg')));
            // console.log(`Written to ${path.join(__dirname, 'testje.jpg')}`);
        }
    }, {
        key: 'mosaics',
        value: function mosaics(layer) {
            var _this = this;

            var request = require('request');
            var size = [layer.rows, layer.cols];
            var factories = Array(size[0]).fill().map(function (v, i) {
                var count = 0;
                return function (cb) {
                    var url = _this.tileUrl(layer.starttile + count * size[0] + i);
                    // console.log(count+', '+i+', '+size[1]);
                    console.log(url);
                    if (++count > size[1]) return cb(null, null);
                    cb(null, request(url).pipe(new _decoder2.default()));
                };
            });

            (0, _mosaicImageStream2.default)(factories, size[1] * 150).on('error', console.error).pipe(new _encoder2.default()).pipe(fs.createWriteStream(path.join(__dirname, 'testjse.jpg')));
        }
    }, {
        key: 'fetchMeta',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var result, body, xmlDoc;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return (0, _nodeFetch2.default)(this.metaUrl);

                            case 2:
                                result = _context3.sent;
                                _context3.next = 5;
                                return result.text();

                            case 5:
                                body = _context3.sent;
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
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchMeta() {
                return _ref3.apply(this, arguments);
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