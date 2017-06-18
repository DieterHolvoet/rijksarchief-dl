'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _libxmljs = require('libxmljs');

var _libxmljs2 = _interopRequireDefault(_libxmljs);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fetcher = function () {
    function Fetcher() {
        _classCallCheck(this, Fetcher);
    }

    _createClass(Fetcher, null, [{
        key: 'getMeta',


        /**
         * Fetch information about an ArchiveDocument
         * @param doc
         * @param scaleFactor
         * @return {Promise.<{tileWidth: Number, tileHeight: Number, mimeType, layers: (*|Array)}>}
         */
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(doc, scaleFactor) {
                var url, response, body, xmlDoc, data, layer;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                url = Fetcher.getMetaUrl(doc);
                                _context.next = 3;
                                return (0, _nodeFetch2.default)(url);

                            case 3:
                                response = _context.sent;
                                _context.next = 6;
                                return response.text();

                            case 6:
                                body = _context.sent;
                                xmlDoc = null;
                                _context.prev = 8;

                                xmlDoc = _libxmljs2.default.parseXml(body);
                                _context.next = 15;
                                break;

                            case 12:
                                _context.prev = 12;
                                _context.t0 = _context['catch'](8);
                                throw new Error('Document with id ' + doc.fif(7) + ' does not exist!');

                            case 15:
                                data = {
                                    tileWidth: parseInt(xmlDoc.get('//tjpinfo/tilewidth').text()),
                                    tileHeight: parseInt(xmlDoc.get('//tjpinfo/tileheight').text()),
                                    mimeType: xmlDoc.get('//tjpinfo/mimetype').text()
                                };
                                layer = xmlDoc.get('//layer[@scalefactor=\'' + scaleFactor + '\']');

                                if (layer) {
                                    _context.next = 19;
                                    break;
                                }

                                throw new Error('Scale factor ' + scaleFactor + ' does not exist for this image.');

                            case 19:

                                ['no', 'starttile', 'cols', 'rows', 'scalefactor', 'width', 'height'].forEach(function (attr) {
                                    data[attr] = parseInt(layer.attr(attr).value());
                                });

                                return _context.abrupt('return', data);

                            case 21:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[8, 12]]);
            }));

            function getMeta(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return getMeta;
        }()

        /**
         * Build a meta url based on an ArchiveDocument
         * @param doc
         * @return {string}
         * @example http://search.arch.be/imageserver/topview.xml.php?FIF=510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2
         */

    }, {
        key: 'getMetaUrl',
        value: function getMetaUrl(doc) {
            var fif = doc.fif(1) + '/' + doc.fif(3) + '/' + doc.fif(5) + '/' + doc.fif(7);
            return 'http://search.arch.be/imageserver/topview.xml.php?FIF=' + fif + '.' + doc.extension;
        }

        /**
         * Fetch a tile
         * @param doc
         * @param tile
         * @return {Promise.<{buffer: *}>}
         */

    }, {
        key: 'getTile',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(doc, tile) {
                var url, response, text;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                url = Fetcher.getTileUrl(doc, tile);
                                _context2.next = 3;
                                return (0, _nodeFetch2.default)(url);

                            case 3:
                                response = _context2.sent;
                                _context2.next = 6;
                                return response.clone().text();

                            case 6:
                                text = _context2.sent;

                                if (!text.includes('Fatal error: Uncaught exception')) {
                                    _context2.next = 9;
                                    break;
                                }

                                throw new Error('Error while downloading tile ' + tile + ': This tile does not exist.');

                            case 9:
                                if (!text.includes('Wrong TILE number')) {
                                    _context2.next = 11;
                                    break;
                                }

                                throw new Error('Error while downloading tile ' + tile + ': Invalid tile number.');

                            case 11:
                                _context2.next = 13;
                                return response.buffer();

                            case 13:
                                _context2.t0 = _context2.sent;
                                return _context2.abrupt('return', {
                                    buffer: _context2.t0
                                });

                            case 15:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getTile(_x3, _x4) {
                return _ref2.apply(this, arguments);
            }

            return getTile;
        }()

        /**
         * Build a tile url based on an ArchiveDocument
         * @param doc
         * @param tile
         * @return {string}
         * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&55
         */

    }, {
        key: 'getTileUrl',
        value: function getTileUrl(doc, tile) {
            var fif = doc.fif(1) + '/' + doc.fif(3) + '/' + doc.fif(5) + '/' + doc.fif(7);
            return 'http://search.arch.be/imageserver/getpic.php?' + fif + '.' + doc.extension + '&' + tile;
        }
    }]);

    return Fetcher;
}();

exports.default = Fetcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GZXRjaGVyLmpzIl0sIm5hbWVzIjpbIkZldGNoZXIiLCJkb2MiLCJzY2FsZUZhY3RvciIsInVybCIsImdldE1ldGFVcmwiLCJyZXNwb25zZSIsInRleHQiLCJib2R5IiwieG1sRG9jIiwicGFyc2VYbWwiLCJFcnJvciIsImZpZiIsImRhdGEiLCJ0aWxlV2lkdGgiLCJwYXJzZUludCIsImdldCIsInRpbGVIZWlnaHQiLCJtaW1lVHlwZSIsImxheWVyIiwiZm9yRWFjaCIsImF0dHIiLCJ2YWx1ZSIsImV4dGVuc2lvbiIsInRpbGUiLCJnZXRUaWxlVXJsIiwiY2xvbmUiLCJpbmNsdWRlcyIsImJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7SUFFTUEsTzs7Ozs7Ozs7O0FBRUY7Ozs7Ozs7a0ZBTXFCQyxHLEVBQUtDLFc7Ozs7OztBQUNoQkMsbUMsR0FBTUgsUUFBUUksVUFBUixDQUFtQkgsR0FBbkIsQzs7dUNBQ1cseUJBQU1FLEdBQU4sQzs7O0FBQWpCRSx3Qzs7dUNBQ2FBLFNBQVNDLElBQVQsRTs7O0FBQWJDLG9DO0FBQ0ZDLHNDLEdBQVMsSTs7O0FBR1RBLHlDQUFTLG1CQUFTQyxRQUFULENBQWtCRixJQUFsQixDQUFUOzs7Ozs7O3NDQUVNLElBQUlHLEtBQUosdUJBQThCVCxJQUFJVSxHQUFKLENBQVEsQ0FBUixDQUE5QixzQjs7O0FBR0pDLG9DLEdBQU87QUFDVEMsK0NBQVdDLFNBQVNOLE9BQU9PLEdBQVAsQ0FBVyxxQkFBWCxFQUFrQ1QsSUFBbEMsRUFBVCxDQURGO0FBRVRVLGdEQUFZRixTQUFTTixPQUFPTyxHQUFQLENBQVcsc0JBQVgsRUFBbUNULElBQW5DLEVBQVQsQ0FGSDtBQUdUVyw4Q0FBVVQsT0FBT08sR0FBUCxDQUFXLG9CQUFYLEVBQWlDVCxJQUFqQztBQUhELGlDO0FBTVBZLHFDLEdBQVFWLE9BQU9PLEdBQVAsNkJBQW9DYixXQUFwQyxTOztvQ0FFVGdCLEs7Ozs7O3NDQUNLLElBQUlSLEtBQUosbUJBQTBCUixXQUExQixxQzs7OztBQUdWLGlDQUFDLElBQUQsRUFBTyxXQUFQLEVBQW9CLE1BQXBCLEVBQTRCLE1BQTVCLEVBQW9DLGFBQXBDLEVBQW1ELE9BQW5ELEVBQTRELFFBQTVELEVBQXNFaUIsT0FBdEUsQ0FBOEUsVUFBQ0MsSUFBRCxFQUFVO0FBQ3BGUix5Q0FBS1EsSUFBTCxJQUFhTixTQUFTSSxNQUFNRSxJQUFOLENBQVdBLElBQVgsRUFBaUJDLEtBQWpCLEVBQVQsQ0FBYjtBQUNILGlDQUZEOztpRUFJT1QsSTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHWDs7Ozs7Ozs7O21DQU1rQlgsRyxFQUFLO0FBQ25CLGdCQUFNVSxNQUFTVixJQUFJVSxHQUFKLENBQVEsQ0FBUixDQUFULFNBQXVCVixJQUFJVSxHQUFKLENBQVEsQ0FBUixDQUF2QixTQUFxQ1YsSUFBSVUsR0FBSixDQUFRLENBQVIsQ0FBckMsU0FBbURWLElBQUlVLEdBQUosQ0FBUSxDQUFSLENBQXpEO0FBQ0EsOEVBQWdFQSxHQUFoRSxTQUF1RVYsSUFBSXFCLFNBQTNFO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7b0ZBTXFCckIsRyxFQUFLc0IsSTs7Ozs7O0FBQ2hCcEIsbUMsR0FBTUgsUUFBUXdCLFVBQVIsQ0FBbUJ2QixHQUFuQixFQUF3QnNCLElBQXhCLEM7O3VDQUNXLHlCQUFNcEIsR0FBTixDOzs7QUFBakJFLHdDOzt1Q0FDY0EsU0FBU29CLEtBQVQsRUFBRCxDQUFtQm5CLElBQW5CLEU7OztBQUFiQSxvQzs7cUNBRUZBLEtBQUtvQixRQUFMLENBQWMsaUNBQWQsQzs7Ozs7c0NBQ00sSUFBSWhCLEtBQUosbUNBQTBDYSxJQUExQyxpQzs7O3FDQUdOakIsS0FBS29CLFFBQUwsQ0FBYyxtQkFBZCxDOzs7OztzQ0FDTSxJQUFJaEIsS0FBSixtQ0FBMENhLElBQTFDLDRCOzs7O3VDQUdhbEIsU0FBU3NCLE1BQVQsRTs7Ozs7QUFBZEEsMEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdiOzs7Ozs7Ozs7O21DQU9rQjFCLEcsRUFBS3NCLEksRUFBTTtBQUN6QixnQkFBTVosTUFBU1YsSUFBSVUsR0FBSixDQUFRLENBQVIsQ0FBVCxTQUF1QlYsSUFBSVUsR0FBSixDQUFRLENBQVIsQ0FBdkIsU0FBcUNWLElBQUlVLEdBQUosQ0FBUSxDQUFSLENBQXJDLFNBQW1EVixJQUFJVSxHQUFKLENBQVEsQ0FBUixDQUF6RDtBQUNBLHFFQUF1REEsR0FBdkQsU0FBOERWLElBQUlxQixTQUFsRSxTQUErRUMsSUFBL0U7QUFDSDs7Ozs7O2tCQUdVdkIsTyIsImZpbGUiOiJGZXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxpYnhtbGpzIGZyb20gJ2xpYnhtbGpzJztcclxuaW1wb3J0IGZldGNoIGZyb20gJ25vZGUtZmV0Y2gnO1xyXG5pbXBvcnQgTG9nIGZyb20gXCIuL0xvZ1wiO1xyXG5cclxuY2xhc3MgRmV0Y2hlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCBpbmZvcm1hdGlvbiBhYm91dCBhbiBBcmNoaXZlRG9jdW1lbnRcclxuICAgICAqIEBwYXJhbSBkb2NcclxuICAgICAqIEBwYXJhbSBzY2FsZUZhY3RvclxyXG4gICAgICogQHJldHVybiB7UHJvbWlzZS48e3RpbGVXaWR0aDogTnVtYmVyLCB0aWxlSGVpZ2h0OiBOdW1iZXIsIG1pbWVUeXBlLCBsYXllcnM6ICgqfEFycmF5KX0+fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0TWV0YShkb2MsIHNjYWxlRmFjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gRmV0Y2hlci5nZXRNZXRhVXJsKGRvYyk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgbGV0IHhtbERvYyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHhtbERvYyA9IGxpYnhtbGpzLnBhcnNlWG1sKGJvZHkpO1xyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERvY3VtZW50IHdpdGggaWQgJHtkb2MuZmlmKDcpfSBkb2VzIG5vdCBleGlzdCFgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHRpbGVXaWR0aDogcGFyc2VJbnQoeG1sRG9jLmdldCgnLy90anBpbmZvL3RpbGV3aWR0aCcpLnRleHQoKSksXHJcbiAgICAgICAgICAgIHRpbGVIZWlnaHQ6IHBhcnNlSW50KHhtbERvYy5nZXQoJy8vdGpwaW5mby90aWxlaGVpZ2h0JykudGV4dCgpKSxcclxuICAgICAgICAgICAgbWltZVR5cGU6IHhtbERvYy5nZXQoJy8vdGpwaW5mby9taW1ldHlwZScpLnRleHQoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGxheWVyID0geG1sRG9jLmdldChgLy9sYXllcltAc2NhbGVmYWN0b3I9JyR7c2NhbGVGYWN0b3J9J11gKTtcclxuXHJcbiAgICAgICAgaWYgKCFsYXllcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNjYWxlIGZhY3RvciAke3NjYWxlRmFjdG9yfSBkb2VzIG5vdCBleGlzdCBmb3IgdGhpcyBpbWFnZS5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFsnbm8nLCAnc3RhcnR0aWxlJywgJ2NvbHMnLCAncm93cycsICdzY2FsZWZhY3RvcicsICd3aWR0aCcsICdoZWlnaHQnXS5mb3JFYWNoKChhdHRyKSA9PiB7XHJcbiAgICAgICAgICAgIGRhdGFbYXR0cl0gPSBwYXJzZUludChsYXllci5hdHRyKGF0dHIpLnZhbHVlKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIGEgbWV0YSB1cmwgYmFzZWQgb24gYW4gQXJjaGl2ZURvY3VtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICAgKiBAZXhhbXBsZSBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvdG9wdmlldy54bWwucGhwP0ZJRj01MTAvNTEwXzE1NDZfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDAvNTEwXzE1NDZfMDAwXzAxODUyXzAwMF8wXzAwMDEuanAyXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRNZXRhVXJsKGRvYykge1xyXG4gICAgICAgIGNvbnN0IGZpZiA9IGAke2RvYy5maWYoMSl9LyR7ZG9jLmZpZigzKX0vJHtkb2MuZmlmKDUpfS8ke2RvYy5maWYoNyl9YDtcclxuICAgICAgICByZXR1cm4gYGh0dHA6Ly9zZWFyY2guYXJjaC5iZS9pbWFnZXNlcnZlci90b3B2aWV3LnhtbC5waHA/RklGPSR7ZmlmfS4ke2RvYy5leHRlbnNpb259YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZldGNoIGEgdGlsZVxyXG4gICAgICogQHBhcmFtIGRvY1xyXG4gICAgICogQHBhcmFtIHRpbGVcclxuICAgICAqIEByZXR1cm4ge1Byb21pc2UuPHtidWZmZXI6ICp9Pn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGdldFRpbGUoZG9jLCB0aWxlKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gRmV0Y2hlci5nZXRUaWxlVXJsKGRvYywgdGlsZSk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCAocmVzcG9uc2UuY2xvbmUoKSkudGV4dCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygnRmF0YWwgZXJyb3I6IFVuY2F1Z2h0IGV4Y2VwdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgZG93bmxvYWRpbmcgdGlsZSAke3RpbGV9OiBUaGlzIHRpbGUgZG9lcyBub3QgZXhpc3QuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygnV3JvbmcgVElMRSBudW1iZXInKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHdoaWxlIGRvd25sb2FkaW5nIHRpbGUgJHt0aWxlfTogSW52YWxpZCB0aWxlIG51bWJlci5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGJ1ZmZlcjogYXdhaXQgcmVzcG9uc2UuYnVmZmVyKCkgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIGEgdGlsZSB1cmwgYmFzZWQgb24gYW4gQXJjaGl2ZURvY3VtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcGFyYW0gdGlsZVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICogQGV4YW1wbGUgaHR0cDovL3NlYXJjaC5hcmNoLmJlL2ltYWdlc2VydmVyL2dldHBpYy5waHA/NTEwLzUxMF8xNTQ2XzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDBfMF8wMDAxLmpwMiY1NVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0VGlsZVVybChkb2MsIHRpbGUpIHtcclxuICAgICAgICBjb25zdCBmaWYgPSBgJHtkb2MuZmlmKDEpfS8ke2RvYy5maWYoMyl9LyR7ZG9jLmZpZig1KX0vJHtkb2MuZmlmKDcpfWA7XHJcbiAgICAgICAgcmV0dXJuIGBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvZ2V0cGljLnBocD8ke2ZpZn0uJHtkb2MuZXh0ZW5zaW9ufSYke3RpbGV9YDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmV0Y2hlcjtcclxuIl19