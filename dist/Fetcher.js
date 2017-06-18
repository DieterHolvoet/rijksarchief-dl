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
            return 'http://search.arch.be/imageserver/getpic.php?' + fif + '.jp2&' + tile;
        }
    }]);

    return Fetcher;
}();

exports.default = Fetcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GZXRjaGVyLmpzIl0sIm5hbWVzIjpbIkZldGNoZXIiLCJkb2MiLCJzY2FsZUZhY3RvciIsInVybCIsImdldE1ldGFVcmwiLCJyZXNwb25zZSIsInRleHQiLCJib2R5IiwieG1sRG9jIiwicGFyc2VYbWwiLCJFcnJvciIsImZpZiIsImRhdGEiLCJ0aWxlV2lkdGgiLCJwYXJzZUludCIsImdldCIsInRpbGVIZWlnaHQiLCJtaW1lVHlwZSIsImxheWVyIiwiZm9yRWFjaCIsImF0dHIiLCJ2YWx1ZSIsInRpbGUiLCJnZXRUaWxlVXJsIiwiY2xvbmUiLCJpbmNsdWRlcyIsImJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7SUFFTUEsTzs7Ozs7Ozs7O0FBRUY7Ozs7Ozs7a0ZBTXFCQyxHLEVBQUtDLFc7Ozs7OztBQUNoQkMsbUMsR0FBTUgsUUFBUUksVUFBUixDQUFtQkgsR0FBbkIsQzs7dUNBQ1cseUJBQU1FLEdBQU4sQzs7O0FBQWpCRSx3Qzs7dUNBQ2FBLFNBQVNDLElBQVQsRTs7O0FBQWJDLG9DO0FBQ0ZDLHNDLEdBQVMsSTs7O0FBR1RBLHlDQUFTLG1CQUFTQyxRQUFULENBQWtCRixJQUFsQixDQUFUOzs7Ozs7O3NDQUVNLElBQUlHLEtBQUosdUJBQThCVCxJQUFJVSxHQUFKLENBQVEsQ0FBUixDQUE5QixzQjs7O0FBR0pDLG9DLEdBQU87QUFDVEMsK0NBQVdDLFNBQVNOLE9BQU9PLEdBQVAsQ0FBVyxxQkFBWCxFQUFrQ1QsSUFBbEMsRUFBVCxDQURGO0FBRVRVLGdEQUFZRixTQUFTTixPQUFPTyxHQUFQLENBQVcsc0JBQVgsRUFBbUNULElBQW5DLEVBQVQsQ0FGSDtBQUdUVyw4Q0FBVVQsT0FBT08sR0FBUCxDQUFXLG9CQUFYLEVBQWlDVCxJQUFqQztBQUhELGlDO0FBTVBZLHFDLEdBQVFWLE9BQU9PLEdBQVAsNkJBQW9DYixXQUFwQyxTOztvQ0FFVGdCLEs7Ozs7O3NDQUNLLElBQUlSLEtBQUosbUJBQTBCUixXQUExQixxQzs7OztBQUdWLGlDQUFDLElBQUQsRUFBTyxXQUFQLEVBQW9CLE1BQXBCLEVBQTRCLE1BQTVCLEVBQW9DLGFBQXBDLEVBQW1ELE9BQW5ELEVBQTRELFFBQTVELEVBQXNFaUIsT0FBdEUsQ0FBOEUsVUFBQ0MsSUFBRCxFQUFVO0FBQ3BGUix5Q0FBS1EsSUFBTCxJQUFhTixTQUFTSSxNQUFNRSxJQUFOLENBQVdBLElBQVgsRUFBaUJDLEtBQWpCLEVBQVQsQ0FBYjtBQUNILGlDQUZEOztpRUFJT1QsSTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHWDs7Ozs7Ozs7bUNBS2tCWCxHLEVBQUs7QUFDbkIsZ0JBQU1VLE1BQVNWLElBQUlVLEdBQUosQ0FBUSxDQUFSLENBQVQsU0FBdUJWLElBQUlVLEdBQUosQ0FBUSxDQUFSLENBQXZCLFNBQXFDVixJQUFJVSxHQUFKLENBQVEsQ0FBUixDQUFyQyxTQUFtRFYsSUFBSVUsR0FBSixDQUFRLENBQVIsQ0FBekQ7QUFDQSw4RUFBZ0VBLEdBQWhFO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7b0ZBTXFCVixHLEVBQUtxQixJOzs7Ozs7QUFDaEJuQixtQyxHQUFNSCxRQUFRdUIsVUFBUixDQUFtQnRCLEdBQW5CLEVBQXdCcUIsSUFBeEIsQzs7dUNBQ1cseUJBQU1uQixHQUFOLEM7OztBQUFqQkUsd0M7O3VDQUNjQSxTQUFTbUIsS0FBVCxFQUFELENBQW1CbEIsSUFBbkIsRTs7O0FBQWJBLG9DOztxQ0FFRkEsS0FBS21CLFFBQUwsQ0FBYyxpQ0FBZCxDOzs7OztzQ0FDTSxJQUFJZixLQUFKLG1DQUEwQ1ksSUFBMUMsaUM7OztxQ0FHTmhCLEtBQUttQixRQUFMLENBQWMsbUJBQWQsQzs7Ozs7c0NBQ00sSUFBSWYsS0FBSixtQ0FBMENZLElBQTFDLDRCOzs7O3VDQUdhakIsU0FBU3FCLE1BQVQsRTs7Ozs7QUFBZEEsMEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdiOzs7Ozs7Ozs7O21DQU9rQnpCLEcsRUFBS3FCLEksRUFBTTtBQUN6QixnQkFBTVgsTUFBU1YsSUFBSVUsR0FBSixDQUFRLENBQVIsQ0FBVCxTQUF1QlYsSUFBSVUsR0FBSixDQUFRLENBQVIsQ0FBdkIsU0FBcUNWLElBQUlVLEdBQUosQ0FBUSxDQUFSLENBQXJDLFNBQW1EVixJQUFJVSxHQUFKLENBQVEsQ0FBUixDQUF6RDtBQUNBLHFFQUF1REEsR0FBdkQsYUFBa0VXLElBQWxFO0FBQ0g7Ozs7OztrQkFHVXRCLE8iLCJmaWxlIjoiRmV0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsaWJ4bWxqcyBmcm9tICdsaWJ4bWxqcyc7XHJcbmltcG9ydCBmZXRjaCBmcm9tICdub2RlLWZldGNoJztcclxuaW1wb3J0IExvZyBmcm9tIFwiLi9Mb2dcIjtcclxuXHJcbmNsYXNzIEZldGNoZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggaW5mb3JtYXRpb24gYWJvdXQgYW4gQXJjaGl2ZURvY3VtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcGFyYW0gc2NhbGVGYWN0b3JcclxuICAgICAqIEByZXR1cm4ge1Byb21pc2UuPHt0aWxlV2lkdGg6IE51bWJlciwgdGlsZUhlaWdodDogTnVtYmVyLCBtaW1lVHlwZSwgbGF5ZXJzOiAoKnxBcnJheSl9Pn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGdldE1ldGEoZG9jLCBzY2FsZUZhY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IEZldGNoZXIuZ2V0TWV0YVVybChkb2MpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIGxldCB4bWxEb2MgPSBudWxsO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB4bWxEb2MgPSBsaWJ4bWxqcy5wYXJzZVhtbChib2R5KTtcclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEb2N1bWVudCB3aXRoIGlkICR7ZG9jLmZpZig3KX0gZG9lcyBub3QgZXhpc3QhYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICB0aWxlV2lkdGg6IHBhcnNlSW50KHhtbERvYy5nZXQoJy8vdGpwaW5mby90aWxld2lkdGgnKS50ZXh0KCkpLFxyXG4gICAgICAgICAgICB0aWxlSGVpZ2h0OiBwYXJzZUludCh4bWxEb2MuZ2V0KCcvL3RqcGluZm8vdGlsZWhlaWdodCcpLnRleHQoKSksXHJcbiAgICAgICAgICAgIG1pbWVUeXBlOiB4bWxEb2MuZ2V0KCcvL3RqcGluZm8vbWltZXR5cGUnKS50ZXh0KClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBsYXllciA9IHhtbERvYy5nZXQoYC8vbGF5ZXJbQHNjYWxlZmFjdG9yPScke3NjYWxlRmFjdG9yfSddYCk7XHJcblxyXG4gICAgICAgIGlmICghbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTY2FsZSBmYWN0b3IgJHtzY2FsZUZhY3Rvcn0gZG9lcyBub3QgZXhpc3QgZm9yIHRoaXMgaW1hZ2UuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBbJ25vJywgJ3N0YXJ0dGlsZScsICdjb2xzJywgJ3Jvd3MnLCAnc2NhbGVmYWN0b3InLCAnd2lkdGgnLCAnaGVpZ2h0J10uZm9yRWFjaCgoYXR0cikgPT4ge1xyXG4gICAgICAgICAgICBkYXRhW2F0dHJdID0gcGFyc2VJbnQobGF5ZXIuYXR0cihhdHRyKS52YWx1ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCBhIG1ldGEgdXJsIGJhc2VkIG9uIGFuIEFyY2hpdmVEb2N1bWVudFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICogQGV4YW1wbGUgaHR0cDovL3NlYXJjaC5hcmNoLmJlL2ltYWdlc2VydmVyL3RvcHZpZXcueG1sLnBocD9GSUY9NTEwLzUxMF8xNTQ2XzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDBfMF8wMDAxLmpwMlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0TWV0YVVybChkb2MpIHtcclxuICAgICAgICBjb25zdCBmaWYgPSBgJHtkb2MuZmlmKDEpfS8ke2RvYy5maWYoMyl9LyR7ZG9jLmZpZig1KX0vJHtkb2MuZmlmKDcpfWA7XHJcbiAgICAgICAgcmV0dXJuIGBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvdG9wdmlldy54bWwucGhwP0ZJRj0ke2ZpZn0uanAyYDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZldGNoIGEgdGlsZVxyXG4gICAgICogQHBhcmFtIGRvY1xyXG4gICAgICogQHBhcmFtIHRpbGVcclxuICAgICAqIEByZXR1cm4ge1Byb21pc2UuPHtidWZmZXI6ICp9Pn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGdldFRpbGUoZG9jLCB0aWxlKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gRmV0Y2hlci5nZXRUaWxlVXJsKGRvYywgdGlsZSk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCAocmVzcG9uc2UuY2xvbmUoKSkudGV4dCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygnRmF0YWwgZXJyb3I6IFVuY2F1Z2h0IGV4Y2VwdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgZG93bmxvYWRpbmcgdGlsZSAke3RpbGV9OiBUaGlzIHRpbGUgZG9lcyBub3QgZXhpc3QuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygnV3JvbmcgVElMRSBudW1iZXInKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHdoaWxlIGRvd25sb2FkaW5nIHRpbGUgJHt0aWxlfTogSW52YWxpZCB0aWxlIG51bWJlci5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGJ1ZmZlcjogYXdhaXQgcmVzcG9uc2UuYnVmZmVyKCkgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIGEgdGlsZSB1cmwgYmFzZWQgb24gYW4gQXJjaGl2ZURvY3VtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcGFyYW0gdGlsZVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICogQGV4YW1wbGUgaHR0cDovL3NlYXJjaC5hcmNoLmJlL2ltYWdlc2VydmVyL2dldHBpYy5waHA/NTEwLzUxMF8xNTQ2XzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDBfMF8wMDAxLmpwMiY1NVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0VGlsZVVybChkb2MsIHRpbGUpIHtcclxuICAgICAgICBjb25zdCBmaWYgPSBgJHtkb2MuZmlmKDEpfS8ke2RvYy5maWYoMyl9LyR7ZG9jLmZpZig1KX0vJHtkb2MuZmlmKDcpfWA7XHJcbiAgICAgICAgcmV0dXJuIGBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvZ2V0cGljLnBocD8ke2ZpZn0uanAyJiR7dGlsZX1gO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGZXRjaGVyO1xyXG4iXX0=