'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _libxmljs = require('libxmljs');

var _libxmljs2 = _interopRequireDefault(_libxmljs);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

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
         * @return {Promise.<{tileWidth: Number, tileHeight: Number, mimeType, layers: (*|Array)}>}
         */
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(doc) {
                var url, response, body, xmlDoc;
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
                                return _context.abrupt('return', {
                                    tileWidth: parseInt(xmlDoc.get('//tjpinfo/tilewidth').text()),
                                    tileHeight: parseInt(xmlDoc.get('//tjpinfo/tileheight').text()),
                                    mimeType: xmlDoc.get('//tjpinfo/mimetype').text(),
                                    layers: xmlDoc.get('//layers').find('layer').map(function (layer) {
                                        var obj = {};
                                        ['no', 'starttile', 'cols', 'rows', 'scalefactor', 'width', 'height'].forEach(function (attr) {
                                            obj[attr] = parseInt(layer.attr(attr).value());
                                        });
                                        return obj;
                                    })
                                });

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[8, 12]]);
            }));

            function getMeta(_x) {
                return _ref.apply(this, arguments);
            }

            return getMeta;
        }()

        /**
         * Build a meta url based on an ArchiveDocument
         * @return {string}
         * @example http://search.arch.be/imageserver/topview.xml.php?FIF=510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2
         */

    }, {
        key: 'getMetaUrl',
        value: function getMetaUrl(doc) {
            var fif = doc.fif(1) + '/' + doc.fif(3) + '/' + doc.fif(5) + '/' + doc.fif(7);
            return 'http://search.arch.be/imageserver/topview.xml.php?FIF=' + fif + '.jp2';
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

            function getTile(_x2, _x3) {
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
            return 'http://search.arch.be/imageserver/getpic.php?' + fif + '.jp2&' + tile;
        }
    }]);

    return Fetcher;
}();

exports.default = Fetcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GZXRjaGVyLmpzIl0sIm5hbWVzIjpbIkZldGNoZXIiLCJkb2MiLCJ1cmwiLCJnZXRNZXRhVXJsIiwicmVzcG9uc2UiLCJ0ZXh0IiwiYm9keSIsInhtbERvYyIsInBhcnNlWG1sIiwiRXJyb3IiLCJmaWYiLCJ0aWxlV2lkdGgiLCJwYXJzZUludCIsImdldCIsInRpbGVIZWlnaHQiLCJtaW1lVHlwZSIsImxheWVycyIsImZpbmQiLCJtYXAiLCJsYXllciIsIm9iaiIsImZvckVhY2giLCJhdHRyIiwidmFsdWUiLCJ0aWxlIiwiZ2V0VGlsZVVybCIsImNsb25lIiwiaW5jbHVkZXMiLCJidWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVNQSxPOzs7Ozs7Ozs7QUFFRjs7Ozs7O2tGQUtxQkMsRzs7Ozs7O0FBQ1hDLG1DLEdBQU1GLFFBQVFHLFVBQVIsQ0FBbUJGLEdBQW5CLEM7O3VDQUNXLHlCQUFNQyxHQUFOLEM7OztBQUFqQkUsd0M7O3VDQUNhQSxTQUFTQyxJQUFULEU7OztBQUFiQyxvQztBQUNGQyxzQyxHQUFTLEk7OztBQUdUQSx5Q0FBUyxtQkFBU0MsUUFBVCxDQUFrQkYsSUFBbEIsQ0FBVDs7Ozs7OztzQ0FFTSxJQUFJRyxLQUFKLHVCQUE4QlIsSUFBSVMsR0FBSixDQUFRLENBQVIsQ0FBOUIsc0I7OztpRUFHSDtBQUNIQywrQ0FBV0MsU0FBU0wsT0FBT00sR0FBUCxDQUFXLHFCQUFYLEVBQWtDUixJQUFsQyxFQUFULENBRFI7QUFFSFMsZ0RBQVlGLFNBQVNMLE9BQU9NLEdBQVAsQ0FBVyxzQkFBWCxFQUFtQ1IsSUFBbkMsRUFBVCxDQUZUO0FBR0hVLDhDQUFVUixPQUFPTSxHQUFQLENBQVcsb0JBQVgsRUFBaUNSLElBQWpDLEVBSFA7QUFJSFcsNENBQVFULE9BQU9NLEdBQVAsQ0FBVyxVQUFYLEVBQXVCSSxJQUF2QixDQUE0QixPQUE1QixFQUNIQyxHQURHLENBQ0MsVUFBQ0MsS0FBRCxFQUFXO0FBQ1osNENBQU1DLE1BQU0sRUFBWjtBQUNBLHlDQUFDLElBQUQsRUFBTyxXQUFQLEVBQW9CLE1BQXBCLEVBQTRCLE1BQTVCLEVBQW9DLGFBQXBDLEVBQW1ELE9BQW5ELEVBQTRELFFBQTVELEVBQXNFQyxPQUF0RSxDQUE4RSxVQUFDQyxJQUFELEVBQVU7QUFDcEZGLGdEQUFJRSxJQUFKLElBQVlWLFNBQVNPLE1BQU1HLElBQU4sQ0FBV0EsSUFBWCxFQUFpQkMsS0FBakIsRUFBVCxDQUFaO0FBQ0gseUNBRkQ7QUFHQSwrQ0FBT0gsR0FBUDtBQUNILHFDQVBHO0FBSkwsaUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVg7Ozs7Ozs7O21DQUtrQm5CLEcsRUFBSztBQUNuQixnQkFBTVMsTUFBU1QsSUFBSVMsR0FBSixDQUFRLENBQVIsQ0FBVCxTQUF1QlQsSUFBSVMsR0FBSixDQUFRLENBQVIsQ0FBdkIsU0FBcUNULElBQUlTLEdBQUosQ0FBUSxDQUFSLENBQXJDLFNBQW1EVCxJQUFJUyxHQUFKLENBQVEsQ0FBUixDQUF6RDtBQUNBLDhFQUFnRUEsR0FBaEU7QUFDSDs7QUFFRDs7Ozs7Ozs7OztvRkFNcUJULEcsRUFBS3VCLEk7Ozs7OztBQUNoQnRCLG1DLEdBQU1GLFFBQVF5QixVQUFSLENBQW1CeEIsR0FBbkIsRUFBd0J1QixJQUF4QixDOzt1Q0FDVyx5QkFBTXRCLEdBQU4sQzs7O0FBQWpCRSx3Qzs7dUNBQ2NBLFNBQVNzQixLQUFULEVBQUQsQ0FBbUJyQixJQUFuQixFOzs7QUFBYkEsb0M7O3FDQUVGQSxLQUFLc0IsUUFBTCxDQUFjLGlDQUFkLEM7Ozs7O3NDQUNNLElBQUlsQixLQUFKLG1DQUEwQ2UsSUFBMUMsaUM7OztxQ0FHTm5CLEtBQUtzQixRQUFMLENBQWMsbUJBQWQsQzs7Ozs7c0NBQ00sSUFBSWxCLEtBQUosbUNBQTBDZSxJQUExQyw0Qjs7Ozt1Q0FHYXBCLFNBQVN3QixNQUFULEU7Ozs7O0FBQWRBLDBDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHYjs7Ozs7Ozs7OzttQ0FPa0IzQixHLEVBQUt1QixJLEVBQU07QUFDekIsZ0JBQU1kLE1BQVNULElBQUlTLEdBQUosQ0FBUSxDQUFSLENBQVQsU0FBdUJULElBQUlTLEdBQUosQ0FBUSxDQUFSLENBQXZCLFNBQXFDVCxJQUFJUyxHQUFKLENBQVEsQ0FBUixDQUFyQyxTQUFtRFQsSUFBSVMsR0FBSixDQUFRLENBQVIsQ0FBekQ7QUFDQSxxRUFBdURBLEdBQXZELGFBQWtFYyxJQUFsRTtBQUNIOzs7Ozs7a0JBR1V4QixPIiwiZmlsZSI6IkZldGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbGlieG1sanMgZnJvbSAnbGlieG1sanMnO1xyXG5pbXBvcnQgZmV0Y2ggZnJvbSAnbm9kZS1mZXRjaCc7XHJcblxyXG5jbGFzcyBGZXRjaGVyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZldGNoIGluZm9ybWF0aW9uIGFib3V0IGFuIEFyY2hpdmVEb2N1bWVudFxyXG4gICAgICogQHBhcmFtIGRvY1xyXG4gICAgICogQHJldHVybiB7UHJvbWlzZS48e3RpbGVXaWR0aDogTnVtYmVyLCB0aWxlSGVpZ2h0OiBOdW1iZXIsIG1pbWVUeXBlLCBsYXllcnM6ICgqfEFycmF5KX0+fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0TWV0YShkb2MpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBGZXRjaGVyLmdldE1ldGFVcmwoZG9jKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICBsZXQgeG1sRG9jID0gbnVsbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgeG1sRG9jID0gbGlieG1sanMucGFyc2VYbWwoYm9keSk7XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRG9jdW1lbnQgd2l0aCBpZCAke2RvYy5maWYoNyl9IGRvZXMgbm90IGV4aXN0IWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdGlsZVdpZHRoOiBwYXJzZUludCh4bWxEb2MuZ2V0KCcvL3RqcGluZm8vdGlsZXdpZHRoJykudGV4dCgpKSxcclxuICAgICAgICAgICAgdGlsZUhlaWdodDogcGFyc2VJbnQoeG1sRG9jLmdldCgnLy90anBpbmZvL3RpbGVoZWlnaHQnKS50ZXh0KCkpLFxyXG4gICAgICAgICAgICBtaW1lVHlwZTogeG1sRG9jLmdldCgnLy90anBpbmZvL21pbWV0eXBlJykudGV4dCgpLFxyXG4gICAgICAgICAgICBsYXllcnM6IHhtbERvYy5nZXQoJy8vbGF5ZXJzJykuZmluZCgnbGF5ZXInKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgobGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICBbJ25vJywgJ3N0YXJ0dGlsZScsICdjb2xzJywgJ3Jvd3MnLCAnc2NhbGVmYWN0b3InLCAnd2lkdGgnLCAnaGVpZ2h0J10uZm9yRWFjaCgoYXR0cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbYXR0cl0gPSBwYXJzZUludChsYXllci5hdHRyKGF0dHIpLnZhbHVlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCBhIG1ldGEgdXJsIGJhc2VkIG9uIGFuIEFyY2hpdmVEb2N1bWVudFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICogQGV4YW1wbGUgaHR0cDovL3NlYXJjaC5hcmNoLmJlL2ltYWdlc2VydmVyL3RvcHZpZXcueG1sLnBocD9GSUY9NTEwLzUxMF8xNTQ2XzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDBfMF8wMDAxLmpwMlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0TWV0YVVybChkb2MpIHtcclxuICAgICAgICBjb25zdCBmaWYgPSBgJHtkb2MuZmlmKDEpfS8ke2RvYy5maWYoMyl9LyR7ZG9jLmZpZig1KX0vJHtkb2MuZmlmKDcpfWA7XHJcbiAgICAgICAgcmV0dXJuIGBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvdG9wdmlldy54bWwucGhwP0ZJRj0ke2ZpZn0uanAyYDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZldGNoIGEgdGlsZVxyXG4gICAgICogQHBhcmFtIGRvY1xyXG4gICAgICogQHBhcmFtIHRpbGVcclxuICAgICAqIEByZXR1cm4ge1Byb21pc2UuPHtidWZmZXI6ICp9Pn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGdldFRpbGUoZG9jLCB0aWxlKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gRmV0Y2hlci5nZXRUaWxlVXJsKGRvYywgdGlsZSk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCAocmVzcG9uc2UuY2xvbmUoKSkudGV4dCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygnRmF0YWwgZXJyb3I6IFVuY2F1Z2h0IGV4Y2VwdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgZG93bmxvYWRpbmcgdGlsZSAke3RpbGV9OiBUaGlzIHRpbGUgZG9lcyBub3QgZXhpc3QuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygnV3JvbmcgVElMRSBudW1iZXInKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHdoaWxlIGRvd25sb2FkaW5nIHRpbGUgJHt0aWxlfTogSW52YWxpZCB0aWxlIG51bWJlci5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGJ1ZmZlcjogYXdhaXQgcmVzcG9uc2UuYnVmZmVyKCkgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIGEgdGlsZSB1cmwgYmFzZWQgb24gYW4gQXJjaGl2ZURvY3VtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcGFyYW0gdGlsZVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICogQGV4YW1wbGUgaHR0cDovL3NlYXJjaC5hcmNoLmJlL2ltYWdlc2VydmVyL2dldHBpYy5waHA/NTEwLzUxMF8xNTQ2XzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDBfMF8wMDAxLmpwMiY1NVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0VGlsZVVybChkb2MsIHRpbGUpIHtcclxuICAgICAgICBjb25zdCBmaWYgPSBgJHtkb2MuZmlmKDEpfS8ke2RvYy5maWYoMyl9LyR7ZG9jLmZpZig1KX0vJHtkb2MuZmlmKDcpfWA7XHJcbiAgICAgICAgcmV0dXJuIGBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvZ2V0cGljLnBocD8ke2ZpZn0uanAyJiR7dGlsZX1gO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGZXRjaGVyO1xyXG4iXX0=