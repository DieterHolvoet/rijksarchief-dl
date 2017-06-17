'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import rimraf from "rimraf";
// import * as fs from 'fs';


var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _libxmljs = require('libxmljs');

var _libxmljs2 = _interopRequireDefault(_libxmljs);

var _mergeImages = require('merge-images');

var _mergeImages2 = _interopRequireDefault(_mergeImages);

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

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
                var pos, tiles, row, col, url, response, buffer, base;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                pos = layer.starttile;
                                tiles = [];

                                /*
                                const mkdirSync = function (dirPath) {
                                    try {
                                        fs.mkdirSync(dirPath)
                                    } catch (err) {
                                        if (err.code !== 'EEXIST') throw err
                                    }
                                };
                                 const write = (row, col, buffer) => new Promise((resolve, reject) => {
                                    const filename = path.join(__dirname, `./tiles/${row}-${col}.jpg`);
                                    fs.writeFile(filename, buffer, "binary", function (err) {
                                        if (err) reject(err);
                                        else resolve({ filename });
                                    });
                                });
                                 mkdirSync(path.join(__dirname, './tiles'));
                                */

                                console.log('Downloading ' + layer.cols * layer.rows + ' tiles...');

                                row = 0;

                            case 4:
                                if (!(row < layer.rows - 1)) {
                                    _context.next = 22;
                                    break;
                                }

                                col = 0;

                            case 6:
                                if (!(col < layer.cols)) {
                                    _context.next = 19;
                                    break;
                                }

                                url = this.tileUrl(pos);

                                // Fetch image

                                _context.next = 10;
                                return (0, _nodeFetch2.default)(url);

                            case 10:
                                response = _context.sent;
                                _context.next = 13;
                                return response.buffer();

                            case 13:
                                buffer = _context.sent;


                                // Draw image
                                //const { filename } = await write(row, col, buffer);

                                tiles.push({
                                    x: col * this.tileheight,
                                    y: row * this.tilewidth,
                                    src: buffer
                                    // src: filename,
                                });

                                pos++;

                            case 16:
                                col++;
                                _context.next = 6;
                                break;

                            case 19:
                                row++;
                                _context.next = 4;
                                break;

                            case 22:

                                // Build and save image
                                console.log('Stitching together the final image...');
                                _context.next = 25;
                                return (0, _mergeImages2.default)(tiles, {
                                    Canvas: _canvas2.default,
                                    format: this.mimetype,
                                    width: layer.width,
                                    height: layer.height
                                });

                            case 25:
                                base = _context.sent;


                                base64.decode(base.split('data:' + this.mimetype + ';base64')[1], path.join(__dirname, this.fif7 + '.jpg'), function (err, output) {
                                    if (err) throw err;
                                });

                                // Remove tiles
                                // rimraf(`${path.join(__dirname, 'tiles')}/**`);

                                // Open final image
                                (0, _opn2.default)(path.join(__dirname, this.fif7 + '.jpg'));

                            case 28:
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

                                // Extract mimetype
                                this.mimetype = xmlDoc.get('//tjpinfo/mimetype').text();

                                // Extract layers
                                this.layers = xmlDoc.get('//layers').find('layer').map(function (layer) {
                                    var obj = {};
                                    ['no', 'starttile', 'cols', 'rows', 'scalefactor', 'width', 'height'].forEach(function (attr) {
                                        obj[attr] = parseInt(layer.attr(attr).value());
                                    });
                                    return obj;
                                });

                            case 11:
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