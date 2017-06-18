'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _mergeImages = require('merge-images');

var _mergeImages2 = _interopRequireDefault(_mergeImages);

var _asciiProgress = require('ascii-progress');

var _asciiProgress2 = _interopRequireDefault(_asciiProgress);

var _streamToPromise = require('stream-to-promise');

var _streamToPromise2 = _interopRequireDefault(_streamToPromise);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _intoStream = require('into-stream');

var intoStream = _interopRequireWildcard(_intoStream);

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stitcher = function () {
    function Stitcher() {
        _classCallCheck(this, Stitcher);
    }

    _createClass(Stitcher, null, [{
        key: 'writeFile',
        value: function writeFile(buffer, path) {
            return new Promise(function (resolve, reject) {
                fs.writeFile(path, buffer, "binary", function (err) {
                    if (err) reject(err);else resolve({ path: path });
                });
            });
        }
    }, {
        key: 'writeTile',
        value: function writeTile(row, col, buffer) {
            return Stitcher.writeFile(buffer, path.join(__dirname, './tiles/' + row + '-' + col + '.jpg'));
        }
    }, {
        key: 'createTileDirectory',
        value: function createTileDirectory() {
            try {
                fs.mkdirSync(path.join(__dirname, './tiles'));
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }
        }
    }, {
        key: 'buildImage',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(doc) {
                var saveTiles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                var pos, output, totalTiles, tiles, _ref2, buffer, progressBar, row, col, _ref3, _buffer, base, bitmap, rs, ws;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                pos = doc.starttile;
                                output = path.join(__dirname, doc.fif(7) + '@' + doc.scalefactor + '.jpg');
                                totalTiles = doc.cols * doc.rows;
                                tiles = [];

                                // Single image

                                if (!(doc.rows === 1 && doc.cols === 1)) {
                                    _context.next = 14;
                                    break;
                                }

                                _Log2.default.step('Downloading image...');
                                _context.next = 8;
                                return _Fetcher2.default.getTile(doc, pos);

                            case 8:
                                _ref2 = _context.sent;
                                buffer = _ref2.buffer;


                                _Log2.default.step('Saving image...');
                                _context.next = 13;
                                return Stitcher.writeFile(buffer, output);

                            case 13:
                                return _context.abrupt('return', output);

                            case 14:

                                if (saveTiles) {
                                    Stitcher.createTileDirectory();
                                }

                                _Log2.default.step('Downloading ' + totalTiles + ' tiles...');
                                progressBar = new _asciiProgress2.default({
                                    schema: '      :bar :current/:total',
                                    filled: '█',
                                    total: totalTiles,
                                    clear: true
                                });

                                // Fetch tiles

                                row = 0;

                            case 18:
                                col = 0;

                            case 19:
                                if (!(col < doc.cols)) {
                                    _context.next = 33;
                                    break;
                                }

                                _context.next = 22;
                                return _Fetcher2.default.getTile(doc, pos);

                            case 22:
                                _ref3 = _context.sent;
                                _buffer = _ref3.buffer;

                                if (!saveTiles) {
                                    _context.next = 27;
                                    break;
                                }

                                _context.next = 27;
                                return Stitcher.writeTile(row, col, _buffer);

                            case 27:

                                tiles.push({
                                    x: col * doc.tileHeight,
                                    y: row * doc.tileWidth,
                                    src: _buffer
                                });

                                pos++;
                                progressBar.tick();

                            case 30:
                                col++;
                                _context.next = 19;
                                break;

                            case 33:
                                row++;

                            case 34:
                                if (row < doc.rows) {
                                    _context.next = 18;
                                    break;
                                }

                            case 35:

                                // Stitch together tiles
                                _Log2.default.step('Stitching together the final image...');
                                _context.next = 38;
                                return (0, _mergeImages2.default)(tiles, {
                                    Canvas: _canvas2.default,
                                    format: doc.mimeType,
                                    width: doc.width,
                                    height: doc.height
                                });

                            case 38:
                                base = _context.sent;


                                // Save result
                                bitmap = Buffer.from(base.split('data:' + doc.mimeType + ';base64')[1], 'base64');
                                rs = intoStream.default(bitmap);
                                ws = fs.createWriteStream(output);

                                rs.pipe(ws);
                                _context.next = 45;
                                return (0, _streamToPromise2.default)(ws);

                            case 45:
                                return _context.abrupt('return', output);

                            case 46:
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
    }]);

    return Stitcher;
}();

exports.default = Stitcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGl0Y2hlci5qcyJdLCJuYW1lcyI6WyJmcyIsInBhdGgiLCJpbnRvU3RyZWFtIiwiU3RpdGNoZXIiLCJidWZmZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIndyaXRlRmlsZSIsImVyciIsInJvdyIsImNvbCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJta2RpclN5bmMiLCJjb2RlIiwiZG9jIiwic2F2ZVRpbGVzIiwicG9zIiwic3RhcnR0aWxlIiwib3V0cHV0IiwiZmlmIiwic2NhbGVmYWN0b3IiLCJ0b3RhbFRpbGVzIiwiY29scyIsInJvd3MiLCJ0aWxlcyIsInN0ZXAiLCJnZXRUaWxlIiwiY3JlYXRlVGlsZURpcmVjdG9yeSIsInByb2dyZXNzQmFyIiwic2NoZW1hIiwiZmlsbGVkIiwidG90YWwiLCJjbGVhciIsIndyaXRlVGlsZSIsInB1c2giLCJ4IiwidGlsZUhlaWdodCIsInkiLCJ0aWxlV2lkdGgiLCJzcmMiLCJ0aWNrIiwiQ2FudmFzIiwiZm9ybWF0IiwibWltZVR5cGUiLCJ3aWR0aCIsImhlaWdodCIsImJhc2UiLCJiaXRtYXAiLCJCdWZmZXIiLCJmcm9tIiwic3BsaXQiLCJycyIsImRlZmF1bHQiLCJ3cyIsImNyZWF0ZVdyaXRlU3RyZWFtIiwicGlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxFOztBQUNaOztJQUFZQyxJOztBQUNaOztJQUFZQyxVOztBQUNaOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQyxROzs7Ozs7O2tDQUNlQyxNLEVBQVFILEksRUFBTTtBQUMzQixtQkFBTyxJQUFJSSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDUCxtQkFBR1EsU0FBSCxDQUFhUCxJQUFiLEVBQW1CRyxNQUFuQixFQUEyQixRQUEzQixFQUFxQyxVQUFVSyxHQUFWLEVBQWU7QUFDaEQsd0JBQUlBLEdBQUosRUFBU0YsT0FB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QXFCcEMsTUFBckIsQzs7QUFDWGlDLG1DQUFHSSxJQUFILENBQVFGLEVBQVI7O3VDQUNNLCtCQUFnQkEsRUFBaEIsQzs7O2lFQUVDbkMsTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUlBakIsUSIsImZpbGUiOiJTdGl0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW52YXMgZnJvbSAnY2FudmFzJztcbmltcG9ydCBtZXJnZUltYWdlcyBmcm9tICdtZXJnZS1pbWFnZXMnO1xuaW1wb3J0IFByb2dyZXNzQmFyIGZyb20gJ2FzY2lpLXByb2dyZXNzJztcbmltcG9ydCBzdHJlYW1Ub1Byb21pc2UgZnJvbSAnc3RyZWFtLXRvLXByb21pc2UnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGludG9TdHJlYW0gZnJvbSAnaW50by1zdHJlYW0nO1xuaW1wb3J0IEZldGNoZXIgZnJvbSBcIi4vRmV0Y2hlclwiO1xuaW1wb3J0IExvZyBmcm9tIFwiLi9Mb2dcIjtcblxuY2xhc3MgU3RpdGNoZXIge1xuICAgIHN0YXRpYyB3cml0ZUZpbGUoYnVmZmVyLCBwYXRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGUocGF0aCwgYnVmZmVyLCBcImJpbmFyeVwiLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKHsgcGF0aCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyB3cml0ZVRpbGUocm93LCBjb2wsIGJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gU3RpdGNoZXIud3JpdGVGaWxlKGJ1ZmZlciwgcGF0aC5qb2luKF9fZGlybmFtZSwgYC4vdGlsZXMvJHtyb3d9LSR7Y29sfS5qcGdgKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVRpbGVEaXJlY3RvcnkoKSB7XG4gICAgICAgIHRyeSB7IGZzLm1rZGlyU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi90aWxlcycpKSB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIuY29kZSAhPT0gJ0VFWElTVCcpIHRocm93IGVyclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGJ1aWxkSW1hZ2UoZG9jLCBzYXZlVGlsZXMgPSBmYWxzZSkge1xuICAgICAgICBsZXQgcG9zID0gZG9jLnN0YXJ0dGlsZTtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgYCR7ZG9jLmZpZig3KX1AJHtkb2Muc2NhbGVmYWN0b3J9LmpwZ2ApO1xuICAgICAgICBjb25zdCB0b3RhbFRpbGVzID0gZG9jLmNvbHMgKiBkb2Mucm93cztcbiAgICAgICAgY29uc3QgdGlsZXMgPSBbXTtcblxuICAgICAgICAvLyBTaW5nbGUgaW1hZ2VcbiAgICAgICAgaWYgKGRvYy5yb3dzID09PSAxICYmIGRvYy5jb2xzID09PSAxKSB7XG4gICAgICAgICAgICBMb2cuc3RlcChgRG93bmxvYWRpbmcgaW1hZ2UuLi5gKTtcbiAgICAgICAgICAgIGNvbnN0IHsgYnVmZmVyIH0gPSBhd2FpdCBGZXRjaGVyLmdldFRpbGUoZG9jLCBwb3MpO1xuXG4gICAgICAgICAgICBMb2cuc3RlcCgnU2F2aW5nIGltYWdlLi4uJyk7XG4gICAgICAgICAgICBhd2FpdCBTdGl0Y2hlci53cml0ZUZpbGUoYnVmZmVyLCBvdXRwdXQpO1xuXG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNhdmVUaWxlcykge1xuICAgICAgICAgICAgU3RpdGNoZXIuY3JlYXRlVGlsZURpcmVjdG9yeSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgTG9nLnN0ZXAoYERvd25sb2FkaW5nICR7dG90YWxUaWxlc30gdGlsZXMuLi5gKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSBuZXcgUHJvZ3Jlc3NCYXIoe1xuICAgICAgICAgICAgc2NoZW1hOiAnICAgICAgOmJhciA6Y3VycmVudC86dG90YWwnLFxuICAgICAgICAgICAgZmlsbGVkOiAn4paIJyxcbiAgICAgICAgICAgIHRvdGFsIDogdG90YWxUaWxlcyxcbiAgICAgICAgICAgIGNsZWFyOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBGZXRjaCB0aWxlc1xuICAgICAgICBsZXQgcm93ID0gMDtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZG9jLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBidWZmZXIgfSA9IGF3YWl0IEZldGNoZXIuZ2V0VGlsZShkb2MsIHBvcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2F2ZVRpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFN0aXRjaGVyLndyaXRlVGlsZShyb3csIGNvbCwgYnVmZmVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgeDogY29sICogZG9jLnRpbGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHJvdyAqIGRvYy50aWxlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHNyYzogYnVmZmVyLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIudGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93KytcbiAgICAgICAgfSB3aGlsZSAocm93IDwgZG9jLnJvd3MpO1xuXG4gICAgICAgIC8vIFN0aXRjaCB0b2dldGhlciB0aWxlc1xuICAgICAgICBMb2cuc3RlcCgnU3RpdGNoaW5nIHRvZ2V0aGVyIHRoZSBmaW5hbCBpbWFnZS4uLicpO1xuICAgICAgICBjb25zdCBiYXNlID0gYXdhaXQgbWVyZ2VJbWFnZXModGlsZXMsIHtcbiAgICAgICAgICAgIENhbnZhcyxcbiAgICAgICAgICAgIGZvcm1hdDogZG9jLm1pbWVUeXBlLFxuICAgICAgICAgICAgd2lkdGg6IGRvYy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogZG9jLmhlaWdodCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2F2ZSByZXN1bHRcbiAgICAgICAgY29uc3QgYml0bWFwID0gQnVmZmVyLmZyb20oYmFzZS5zcGxpdChgZGF0YToke2RvYy5taW1lVHlwZX07YmFzZTY0YClbMV0sICdiYXNlNjQnKTtcbiAgICAgICAgY29uc3QgcnMgPSBpbnRvU3RyZWFtLmRlZmF1bHQoYml0bWFwKTtcbiAgICAgICAgY29uc3Qgd3MgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShvdXRwdXQpO1xuICAgICAgICBycy5waXBlKHdzKTtcbiAgICAgICAgYXdhaXQgc3RyZWFtVG9Qcm9taXNlKHdzKTtcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RpdGNoZXI7XG4iXX0=