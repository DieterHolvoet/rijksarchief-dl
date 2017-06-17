'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _libxmljs = require('libxmljs');

var _libxmljs2 = _interopRequireDefault(_libxmljs);

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
        key: 'fetchMeta',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var result, body, xmlDoc;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _nodeFetch2.default)(this.metaUrl);

                            case 2:
                                result = _context.sent;
                                _context.next = 5;
                                return result.text();

                            case 5:
                                body = _context.sent;
                                xmlDoc = _libxmljs2.default.parseXml(body);

                                // Extract layers

                                this.layers = xmlDoc.get('//layers').find('layer').map(function (layer) {
                                    return {
                                        no: layer.attr('no').value(),
                                        start: layer.attr('starttile').value(),
                                        cols: layer.attr('cols').value(),
                                        rows: layer.attr('rows').value(),
                                        scale: layer.attr('scalefactor').value(),
                                        width: layer.attr('width').value(),
                                        height: layer.attr('height').value()
                                    };
                                });

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchMeta() {
                return _ref.apply(this, arguments);
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