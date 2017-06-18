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
        value: function writeTile(row, col, buffer, output) {
            return Stitcher.writeFile(buffer, path.join(output, './tiles/' + row + '-' + col + '.jpg'));
        }
    }, {
        key: 'createTileDirectory',
        value: function createTileDirectory(output) {
            try {
                fs.mkdirSync(path.join(output, './tiles'));
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }
        }
    }, {
        key: 'buildImage',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(doc, outputFolder) {
                var saveTiles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                var pos, totalTiles, tiles, outputFile, _ref2, buffer, progressBar, row, col, _ref3, _buffer, base, bitmap, rs, ws;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                pos = doc.starttile;
                                totalTiles = doc.cols * doc.rows;
                                tiles = [];
                                outputFile = path.join(outputFolder, doc.fif(7) + '@' + doc.scalefactor + '.jpg');

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
                                return Stitcher.writeFile(buffer, outputFile);

                            case 13:
                                return _context.abrupt('return', outputFile);

                            case 14:

                                if (saveTiles) {
                                    Stitcher.createTileDirectory(outputFolder);
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
                                return Stitcher.writeTile(row, col, _buffer, outputFolder);

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
                                ws = fs.createWriteStream(outputFile);

                                rs.pipe(ws);
                                _context.next = 45;
                                return (0, _streamToPromise2.default)(ws);

                            case 45:
                                return _context.abrupt('return', outputFile);

                            case 46:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function buildImage(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return buildImage;
        }()
    }]);

    return Stitcher;
}();

exports.default = Stitcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGl0Y2hlci5qcyJdLCJuYW1lcyI6WyJmcyIsInBhdGgiLCJpbnRvU3RyZWFtIiwiU3RpdGNoZXIiLCJidWZmZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIndyaXRlRmlsZSIsImVyciIsInJvdyIsImNvbCIsIm91dHB1dCIsImpvaW4iLCJta2RpclN5bmMiLCJjb2RlIiwiZG9jIiwib3V0cHV0Rm9sZGVyIiwic2F2ZVRpbGVzIiwicG9zIiwic3RhcnR0aWxlIiwidG90YWxUaWxlcyIsImNvbHMiLCJyb3dzIiwidGlsZXMiLCJvdXRwdXRGaWxlIiwiZmlmIiwic2NhbGVmYWN0b3IiLCJzdGVwIiwiZ2V0VGlsZSIsImNyZWF0ZVRpbGVEaXJlY3RvcnkiLCJwcm9ncmVzc0JhciIsInNjaGVtYSIsImZpbGxlZCIsInRvdGFsIiwiY2xlYXIiLCJ3cml0ZVRpbGUiLCJwdXNoIiwieCIsInRpbGVIZWlnaHQiLCJ5IiwidGlsZVdpZHRoIiwic3JjIiwidGljayIsIkNhbnZhcyIsImZvcm1hdCIsIm1pbWVUeXBlIiwid2lkdGgiLCJoZWlnaHQiLCJiYXNlIiwiYml0bWFwIiwiQnVmZmVyIiwiZnJvbSIsInNwbGl0IiwicnMiLCJkZWZhdWx0Iiwid3MiLCJjcmVhdGVXcml0ZVN0cmVhbSIsInBpcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUEsRTs7QUFDWjs7SUFBWUMsSTs7QUFDWjs7SUFBWUMsVTs7QUFDWjs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUMsUTs7Ozs7OztrQ0FDZUMsTSxFQUFRSCxJLEVBQU07QUFDM0IsbUJBQU8sSUFBSUksT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQ1AsbUJBQUdRLFNBQUgsQ0FBYVAsSUFBYixFQUFtQkcsTUFBbkIsRUFBMkIsUUFBM0IsRUFBcUMsVUFBVUssR0FBVixFQUFlO0FBQ2hELHdCQUFJ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LEdBQUtwRCxXQUFXcUQsT0FBWCxDQUFtQkwsTUFBbkIsQztBQUNMTSxrQyxHQUFLeEQsR0FBR3lELGlCQUFILENBQXFCaEMsVUFBckIsQzs7QUFDWDZCLG1DQUFHSSxJQUFILENBQVFGLEVBQVI7O3VDQUNNLCtCQUFnQkEsRUFBaEIsQzs7O2lFQUVDL0IsVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUlBdEIsUSIsImZpbGUiOiJTdGl0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW52YXMgZnJvbSAnY2FudmFzJztcbmltcG9ydCBtZXJnZUltYWdlcyBmcm9tICdtZXJnZS1pbWFnZXMnO1xuaW1wb3J0IFByb2dyZXNzQmFyIGZyb20gJ2FzY2lpLXByb2dyZXNzJztcbmltcG9ydCBzdHJlYW1Ub1Byb21pc2UgZnJvbSAnc3RyZWFtLXRvLXByb21pc2UnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGludG9TdHJlYW0gZnJvbSAnaW50by1zdHJlYW0nO1xuaW1wb3J0IEZldGNoZXIgZnJvbSBcIi4vRmV0Y2hlclwiO1xuaW1wb3J0IExvZyBmcm9tIFwiLi9Mb2dcIjtcblxuY2xhc3MgU3RpdGNoZXIge1xuICAgIHN0YXRpYyB3cml0ZUZpbGUoYnVmZmVyLCBwYXRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGUocGF0aCwgYnVmZmVyLCBcImJpbmFyeVwiLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKHsgcGF0aCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyB3cml0ZVRpbGUocm93LCBjb2wsIGJ1ZmZlciwgb3V0cHV0KSB7XG4gICAgICAgIHJldHVybiBTdGl0Y2hlci53cml0ZUZpbGUoYnVmZmVyLCBwYXRoLmpvaW4ob3V0cHV0LCBgLi90aWxlcy8ke3Jvd30tJHtjb2x9LmpwZ2ApKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlVGlsZURpcmVjdG9yeShvdXRwdXQpIHtcbiAgICAgICAgdHJ5IHsgZnMubWtkaXJTeW5jKHBhdGguam9pbihvdXRwdXQsICcuL3RpbGVzJykpIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyci5jb2RlICE9PSAnRUVYSVNUJykgdGhyb3cgZXJyXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgYnVpbGRJbWFnZShkb2MsIG91dHB1dEZvbGRlciwgc2F2ZVRpbGVzID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHBvcyA9IGRvYy5zdGFydHRpbGU7XG4gICAgICAgIGNvbnN0IHRvdGFsVGlsZXMgPSBkb2MuY29scyAqIGRvYy5yb3dzO1xuICAgICAgICBjb25zdCB0aWxlcyA9IFtdO1xuICAgICAgICBjb25zdCBvdXRwdXRGaWxlID0gcGF0aC5qb2luKG91dHB1dEZvbGRlciwgYCR7ZG9jLmZpZig3KX1AJHtkb2Muc2NhbGVmYWN0b3J9LmpwZ2ApO1xuXG4gICAgICAgIC8vIFNpbmdsZSBpbWFnZVxuICAgICAgICBpZiAoZG9jLnJvd3MgPT09IDEgJiYgZG9jLmNvbHMgPT09IDEpIHtcbiAgICAgICAgICAgIExvZy5zdGVwKGBEb3dubG9hZGluZyBpbWFnZS4uLmApO1xuICAgICAgICAgICAgY29uc3QgeyBidWZmZXIgfSA9IGF3YWl0IEZldGNoZXIuZ2V0VGlsZShkb2MsIHBvcyk7XG5cbiAgICAgICAgICAgIExvZy5zdGVwKCdTYXZpbmcgaW1hZ2UuLi4nKTtcbiAgICAgICAgICAgIGF3YWl0IFN0aXRjaGVyLndyaXRlRmlsZShidWZmZXIsIG91dHB1dEZpbGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0RmlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzYXZlVGlsZXMpIHtcbiAgICAgICAgICAgIFN0aXRjaGVyLmNyZWF0ZVRpbGVEaXJlY3Rvcnkob3V0cHV0Rm9sZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIExvZy5zdGVwKGBEb3dubG9hZGluZyAke3RvdGFsVGlsZXN9IHRpbGVzLi4uYCk7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gbmV3IFByb2dyZXNzQmFyKHtcbiAgICAgICAgICAgIHNjaGVtYTogJyAgICAgIDpiYXIgOmN1cnJlbnQvOnRvdGFsJyxcbiAgICAgICAgICAgIGZpbGxlZDogJ+KWiCcsXG4gICAgICAgICAgICB0b3RhbCA6IHRvdGFsVGlsZXMsXG4gICAgICAgICAgICBjbGVhcjogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRmV0Y2ggdGlsZXNcbiAgICAgICAgbGV0IHJvdyA9IDA7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGRvYy5jb2xzOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYnVmZmVyIH0gPSBhd2FpdCBGZXRjaGVyLmdldFRpbGUoZG9jLCBwb3MpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNhdmVUaWxlcykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBTdGl0Y2hlci53cml0ZVRpbGUocm93LCBjb2wsIGJ1ZmZlciwgb3V0cHV0Rm9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgeDogY29sICogZG9jLnRpbGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHJvdyAqIGRvYy50aWxlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHNyYzogYnVmZmVyLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIudGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93KytcbiAgICAgICAgfSB3aGlsZSAocm93IDwgZG9jLnJvd3MpO1xuXG4gICAgICAgIC8vIFN0aXRjaCB0b2dldGhlciB0aWxlc1xuICAgICAgICBMb2cuc3RlcCgnU3RpdGNoaW5nIHRvZ2V0aGVyIHRoZSBmaW5hbCBpbWFnZS4uLicpO1xuICAgICAgICBjb25zdCBiYXNlID0gYXdhaXQgbWVyZ2VJbWFnZXModGlsZXMsIHtcbiAgICAgICAgICAgIENhbnZhcyxcbiAgICAgICAgICAgIGZvcm1hdDogZG9jLm1pbWVUeXBlLFxuICAgICAgICAgICAgd2lkdGg6IGRvYy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogZG9jLmhlaWdodCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2F2ZSByZXN1bHRcbiAgICAgICAgY29uc3QgYml0bWFwID0gQnVmZmVyLmZyb20oYmFzZS5zcGxpdChgZGF0YToke2RvYy5taW1lVHlwZX07YmFzZTY0YClbMV0sICdiYXNlNjQnKTtcbiAgICAgICAgY29uc3QgcnMgPSBpbnRvU3RyZWFtLmRlZmF1bHQoYml0bWFwKTtcbiAgICAgICAgY29uc3Qgd3MgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShvdXRwdXRGaWxlKTtcbiAgICAgICAgcnMucGlwZSh3cyk7XG4gICAgICAgIGF3YWl0IHN0cmVhbVRvUHJvbWlzZSh3cyk7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dEZpbGU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdGl0Y2hlcjtcbiJdfQ==