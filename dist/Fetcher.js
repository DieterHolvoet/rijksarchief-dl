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
                                xmlDoc = _libxmljs2.default.parseXml(body);

                                if (!false) {
                                    _context.next = 10;
                                    break;
                                }

                                throw new Error('Document with ID ' + doc.fif(7) + ' does not exist!');

                            case 10:
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

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
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
                var url, response, buffer;
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
                                return response.buffer();

                            case 6:
                                buffer = _context2.sent;
                                return _context2.abrupt('return', { buffer: buffer });

                            case 8:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GZXRjaGVyLmpzIl0sIm5hbWVzIjpbIkZldGNoZXIiLCJkb2MiLCJ1cmwiLCJnZXRNZXRhVXJsIiwicmVzcG9uc2UiLCJ0ZXh0IiwiYm9keSIsInhtbERvYyIsInBhcnNlWG1sIiwiRXJyb3IiLCJmaWYiLCJ0aWxlV2lkdGgiLCJwYXJzZUludCIsImdldCIsInRpbGVIZWlnaHQiLCJtaW1lVHlwZSIsImxheWVycyIsImZpbmQiLCJtYXAiLCJsYXllciIsIm9iaiIsImZvckVhY2giLCJhdHRyIiwidmFsdWUiLCJ0aWxlIiwiZ2V0VGlsZVVybCIsImJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRU1BLE87Ozs7Ozs7OztBQUVGOzs7Ozs7a0ZBS3FCQyxHOzs7Ozs7QUFDWEMsbUMsR0FBTUYsUUFBUUcsVUFBUixDQUFtQkYsR0FBbkIsQzs7dUNBQ1cseUJBQU1DLEdBQU4sQzs7O0FBQWpCRSx3Qzs7dUNBQ2FBLFNBQVNDLElBQVQsRTs7O0FBQWJDLG9DO0FBQ0FDLHNDLEdBQVMsbUJBQVNDLFFBQVQsQ0FBa0JGLElBQWxCLEM7O3FDQUNYLEs7Ozs7O3NDQUNNLElBQUlHLEtBQUosdUJBQThCUixJQUFJUyxHQUFKLENBQVEsQ0FBUixDQUE5QixzQjs7O2lFQUVIO0FBQ0hDLCtDQUFXQyxTQUFTTCxPQUFPTSxHQUFQLENBQVcscUJBQVgsRUFBa0NSLElBQWxDLEVBQVQsQ0FEUjtBQUVIUyxnREFBWUYsU0FBU0wsT0FBT00sR0FBUCxDQUFXLHNCQUFYLEVBQW1DUixJQUFuQyxFQUFULENBRlQ7QUFHSFUsOENBQVVSLE9BQU9NLEdBQVAsQ0FBVyxvQkFBWCxFQUFpQ1IsSUFBakMsRUFIUDtBQUlIVyw0Q0FBUVQsT0FBT00sR0FBUCxDQUFXLFVBQVgsRUFBdUJJLElBQXZCLENBQTRCLE9BQTVCLEVBQ0hDLEdBREcsQ0FDQyxVQUFDQyxLQUFELEVBQVc7QUFDWiw0Q0FBTUMsTUFBTSxFQUFaO0FBQ0EseUNBQUMsSUFBRCxFQUFPLFdBQVAsRUFBb0IsTUFBcEIsRUFBNEIsTUFBNUIsRUFBb0MsYUFBcEMsRUFBbUQsT0FBbkQsRUFBNEQsUUFBNUQsRUFBc0VDLE9BQXRFLENBQThFLFVBQUNDLElBQUQsRUFBVTtBQUNwRkYsZ0RBQUlFLElBQUosSUFBWVYsU0FBU08sTUFBTUcsSUFBTixDQUFXQSxJQUFYLEVBQWlCQyxLQUFqQixFQUFULENBQVo7QUFDSCx5Q0FGRDtBQUdBLCtDQUFPSCxHQUFQO0FBQ0gscUNBUEc7QUFKTCxpQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWDs7Ozs7Ozs7bUNBS2tCbkIsRyxFQUFLO0FBQ25CLGdCQUFNUyxNQUFTVCxJQUFJUyxHQUFKLENBQVEsQ0FBUixDQUFULFNBQXVCVCxJQUFJUyxHQUFKLENBQVEsQ0FBUixDQUF2QixTQUFxQ1QsSUFBSVMsR0FBSixDQUFRLENBQVIsQ0FBckMsU0FBbURULElBQUlTLEdBQUosQ0FBUSxDQUFSLENBQXpEO0FBQ0EsOEVBQWdFQSxHQUFoRTtBQUNIOztBQUVEOzs7Ozs7Ozs7O29GQU1xQlQsRyxFQUFLdUIsSTs7Ozs7O0FBQ2hCdEIsbUMsR0FBTUYsUUFBUXlCLFVBQVIsQ0FBbUJ4QixHQUFuQixFQUF3QnVCLElBQXhCLEM7O3VDQUNXLHlCQUFNdEIsR0FBTixDOzs7QUFBakJFLHdDOzt1Q0FDZUEsU0FBU3NCLE1BQVQsRTs7O0FBQWZBLHNDO2tFQUVDLEVBQUVBLGNBQUYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHWDs7Ozs7Ozs7O21DQU1rQnpCLEcsRUFBS3VCLEksRUFBTTtBQUN6QixnQkFBTWQsTUFBU1QsSUFBSVMsR0FBSixDQUFRLENBQVIsQ0FBVCxTQUF1QlQsSUFBSVMsR0FBSixDQUFRLENBQVIsQ0FBdkIsU0FBcUNULElBQUlTLEdBQUosQ0FBUSxDQUFSLENBQXJDLFNBQW1EVCxJQUFJUyxHQUFKLENBQVEsQ0FBUixDQUF6RDtBQUNBLHFFQUF1REEsR0FBdkQsYUFBa0VjLElBQWxFO0FBQ0g7Ozs7OztrQkFHVXhCLE8iLCJmaWxlIjoiRmV0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsaWJ4bWxqcyBmcm9tICdsaWJ4bWxqcyc7XHJcbmltcG9ydCBmZXRjaCBmcm9tICdub2RlLWZldGNoJztcclxuXHJcbmNsYXNzIEZldGNoZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggaW5mb3JtYXRpb24gYWJvdXQgYW4gQXJjaGl2ZURvY3VtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlLjx7dGlsZVdpZHRoOiBOdW1iZXIsIHRpbGVIZWlnaHQ6IE51bWJlciwgbWltZVR5cGUsIGxheWVyczogKCp8QXJyYXkpfT59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBnZXRNZXRhKGRvYykge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IEZldGNoZXIuZ2V0TWV0YVVybChkb2MpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IHhtbERvYyA9IGxpYnhtbGpzLnBhcnNlWG1sKGJvZHkpO1xyXG4gICAgICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERvY3VtZW50IHdpdGggSUQgJHtkb2MuZmlmKDcpfSBkb2VzIG5vdCBleGlzdCFgKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0aWxlV2lkdGg6IHBhcnNlSW50KHhtbERvYy5nZXQoJy8vdGpwaW5mby90aWxld2lkdGgnKS50ZXh0KCkpLFxyXG4gICAgICAgICAgICB0aWxlSGVpZ2h0OiBwYXJzZUludCh4bWxEb2MuZ2V0KCcvL3RqcGluZm8vdGlsZWhlaWdodCcpLnRleHQoKSksXHJcbiAgICAgICAgICAgIG1pbWVUeXBlOiB4bWxEb2MuZ2V0KCcvL3RqcGluZm8vbWltZXR5cGUnKS50ZXh0KCksXHJcbiAgICAgICAgICAgIGxheWVyczogeG1sRG9jLmdldCgnLy9sYXllcnMnKS5maW5kKCdsYXllcicpXHJcbiAgICAgICAgICAgICAgICAubWFwKChsYXllcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIFsnbm8nLCAnc3RhcnR0aWxlJywgJ2NvbHMnLCAncm93cycsICdzY2FsZWZhY3RvcicsICd3aWR0aCcsICdoZWlnaHQnXS5mb3JFYWNoKChhdHRyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialthdHRyXSA9IHBhcnNlSW50KGxheWVyLmF0dHIoYXR0cikudmFsdWUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIGEgbWV0YSB1cmwgYmFzZWQgb24gYW4gQXJjaGl2ZURvY3VtZW50XHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICAgKiBAZXhhbXBsZSBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvdG9wdmlldy54bWwucGhwP0ZJRj01MTAvNTEwXzE1NDZfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDAvNTEwXzE1NDZfMDAwXzAxODUyXzAwMF8wXzAwMDEuanAyXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRNZXRhVXJsKGRvYykge1xyXG4gICAgICAgIGNvbnN0IGZpZiA9IGAke2RvYy5maWYoMSl9LyR7ZG9jLmZpZigzKX0vJHtkb2MuZmlmKDUpfS8ke2RvYy5maWYoNyl9YDtcclxuICAgICAgICByZXR1cm4gYGh0dHA6Ly9zZWFyY2guYXJjaC5iZS9pbWFnZXNlcnZlci90b3B2aWV3LnhtbC5waHA/RklGPSR7ZmlmfS5qcDJgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggYSB0aWxlXHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcGFyYW0gdGlsZVxyXG4gICAgICogQHJldHVybiB7UHJvbWlzZS48e2J1ZmZlcjogKn0+fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0VGlsZShkb2MsIHRpbGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBGZXRjaGVyLmdldFRpbGVVcmwoZG9jLCB0aWxlKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgcmVzcG9uc2UuYnVmZmVyKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IGJ1ZmZlciB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgYSB0aWxlIHVybCBiYXNlZCBvbiBhbiBBcmNoaXZlRG9jdW1lbnRcclxuICAgICAqIEBwYXJhbSBkb2NcclxuICAgICAqIEBwYXJhbSB0aWxlXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRUaWxlVXJsKGRvYywgdGlsZSkge1xyXG4gICAgICAgIGNvbnN0IGZpZiA9IGAke2RvYy5maWYoMSl9LyR7ZG9jLmZpZigzKX0vJHtkb2MuZmlmKDUpfS8ke2RvYy5maWYoNyl9YDtcclxuICAgICAgICByZXR1cm4gYGh0dHA6Ly9zZWFyY2guYXJjaC5iZS9pbWFnZXNlcnZlci9nZXRwaWMucGhwPyR7ZmlmfS5qcDImJHt0aWxlfWA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZldGNoZXI7XHJcbiJdfQ==