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
        key: 'writeTile',
        value: function writeTile(row, col, buffer) {
            return new Promise(function (resolve, reject) {
                var filename = path.join(__dirname, './tiles/' + row + '-' + col + '.jpg');
                fs.writeFile(filename, buffer, "binary", function (err) {
                    if (err) reject(err);else resolve({ filename: filename });
                });
            });
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
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(doc, layer) {
                var saveTiles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                var pos, output, totalTiles, tiles, progressBar, row, col, _ref2, buffer, base, bitmap, rs, ws;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                pos = layer.starttile;
                                output = path.join(__dirname, doc.fif(7) + '.jpg');
                                totalTiles = layer.cols * (layer.rows - 1);
                                tiles = [];


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

                            case 8:
                                if (!(row < layer.rows - 1)) {
                                    _context.next = 27;
                                    break;
                                }

                                col = 0;

                            case 10:
                                if (!(col < layer.cols)) {
                                    _context.next = 24;
                                    break;
                                }

                                _context.next = 13;
                                return _Fetcher2.default.getTile(doc, pos);

                            case 13:
                                _ref2 = _context.sent;
                                buffer = _ref2.buffer;

                                if (!saveTiles) {
                                    _context.next = 18;
                                    break;
                                }

                                _context.next = 18;
                                return Stitcher.writeTile(row, col, buffer);

                            case 18:

                                tiles.push({
                                    x: col * doc.tileHeight,
                                    y: row * doc.tileWidth,
                                    src: buffer
                                });

                                pos++;
                                progressBar.tick();

                            case 21:
                                col++;
                                _context.next = 10;
                                break;

                            case 24:
                                row++;
                                _context.next = 8;
                                break;

                            case 27:

                                // Stitch together tiles
                                _Log2.default.step('Stitching together the final image...');
                                _context.next = 30;
                                return (0, _mergeImages2.default)(tiles, {
                                    Canvas: _canvas2.default,
                                    format: doc.mimeType,
                                    width: layer.width,
                                    height: layer.height
                                });

                            case 30:
                                base = _context.sent;


                                // Save result
                                bitmap = Buffer.from(base.split('data:' + doc.mimeType + ';base64')[1], 'base64');
                                rs = intoStream.default(bitmap);
                                ws = fs.createWriteStream(output);

                                rs.pipe(ws);
                                _context.next = 37;
                                return (0, _streamToPromise2.default)(ws);

                            case 37:
                                return _context.abrupt('return', output);

                            case 38:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGl0Y2hlci5qcyJdLCJuYW1lcyI6WyJmcyIsInBhdGgiLCJpbnRvU3RyZWFtIiwiU3RpdGNoZXIiLCJyb3ciLCJjb2wiLCJidWZmZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZpbGVuYW1lIiwiam9pbiIsIl9fZGlybmFtZSIsIndyaXRlRmlsZSIsImVyciIsIm1rZGlyU3luYyIsImNvZGUiLCJkb2MiLCJsYXllciIsInNhdmVUaWxlcyIsInBvcyIsInN0YXJ0dGlsZSIsIm91dHB1dCIsImZpZiIsInRvdGFsVGlsZXMiLCJjb2xzIiwicm93cyIsInRpbGVzIiwiY3JlYXRlVGlsZURpcmVjdG9yeSIsInN0ZXAiLCJwcm9ncmVzc0JhciIsInNjaGVtYSIsImZpbGxlZCIsInRvdGFsIiwiY2xlYXIiLCJnZXRUaWxlIiwid3JpdGVUaWxlIiwicHVzaCIsIngiLCJ0aWxlSGVpZ2h0IiwieSIsInRpbGVXaWR0aCIsInNyYyIsInRpY2siLCJDYW52YXMiLCJmb3JtYXQiLCJtaW1lVHlwZSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFzZSIsImJpdG1hcCIsIkJ1ZmZlciIsImZyb20iLCJzcGxpdCIsInJzIiwiZGVmYXVsdCIsIndzIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJwaXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEU7O0FBQ1o7O0lBQVlDLEk7O0FBQ1o7O0lBQVlDLFU7O0FBQ1o7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1DLFE7Ozs7Ozs7a0NBQ2VDLEcsRUFBS0MsRyxFQUFLQyxNLEVBQVE7QUFDL0IsbUJBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQyxvQkFBTUMsV0FBV1QsS0FBS1UsSUFBTCxDQUFVQyxTQUFWLGVBQWdDUixHQUFoQyxTQUF1Q0MsR0FBdkMsVUFBakI7QUFDQUwsbUJBQUdhLFNBQUgsQ0FBYUgsUUFBYixFQUF1QkosTUFBdkIsRUFBK0IsUUFBL0IsRUFBeUMsVUFBVVEsR0FBVixFQUFlO0FBQ3BELHdCQUFJQSxHQUFKLEVBQVNMLE9BQU9LLEdBQVAsRUFBVCxLQUNLTixRQUFRLEVBQUVFLGtCQUFGLEVBQVI7QUFDUixpQkFIRDtBQUlILGFBTk0sQ0FBUDtBQU9IOzs7OENBRTRCO0FBQ3pCLGdCQUFJO0FBQUVWLG1CQUFHZSxTQUFILENBQWFkLEtBQUtVLElBQUwsQ0FBVUMsU0FBVixFQUFxQixTQUFyQixDQUFiO0FBQStDLGFBQXJELENBQXNELE9BQU9FLEdBQVAsRUFBWTtBQUM5RCxvQkFBSUEsSUFBSUUsSUFBSixLQUFhLFFBQWpCLEVBQTJCLE1BQU1GLEdBQU47QUFDOUI7QUFDSjs7OztrRkFFdUJHLEcsRUFBS0MsSztvQkFBT0MsUyx1RUFBWSxLOzs7Ozs7OztBQUN4Q0MsbUMsR0FBTUYsTUFBTUcsUztBQUNWQyxzQyxHQUFTckIsS0FBS1UsSUFBTCxDQUFVQyxTQUFWLEVBQXdCSyxJQUFJTSxHQUFKLENBQVEsQ0FBUixDQUF4QixVO0FBQ1RDLDBDLEdBQWFOLE1BQU1PLElBQU4sSUFBY1AsTUFBTVEsSUFBTixHQUFhLENBQTNCLEM7QUFDYkMscUMsR0FBUSxFOzs7QUFFZCxvQ0FBSVIsU0FBSixFQUFlO0FBQ1hoQiw2Q0FBU3lCLG1CQUFUO0FBQ0g7O0FBRUQsOENBQUlDLElBQUosa0JBQXdCTCxVQUF4QjtBQUNNTSwyQyxHQUFjLDRCQUFnQjtBQUNoQ0MsNENBQVEsNEJBRHdCO0FBRWhDQyw0Q0FBUSxHQUZ3QjtBQUdoQ0MsMkNBQVFULFVBSHdCO0FBSWhDVSwyQ0FBTztBQUp5QixpQ0FBaEIsQzs7QUFPcEI7O0FBQ1M5QixtQyxHQUFNLEM7OztzQ0FBR0EsTUFBTWMsTUFBTVEsSUFBTixHQUFhLEM7Ozs7O0FBQ3hCckIsbUMsR0FBTSxDOzs7c0NBQUdBLE1BQU1hLE1BQU1PLEk7Ozs7Ozt1Q0FDRCxrQkFBUVUsT0FBUixDQUFnQmxCLEdBQWhCLEVBQXFCRyxHQUFyQixDOzs7O0FBQWpCZCxzQyxTQUFBQSxNOztxQ0FFSmEsUzs7Ozs7O3VDQUNNaEIsU0FBU2lDLFNBQVQsQ0FBbUJoQyxHQUFuQixFQUF3QkMsR0FBeEIsRUFBNkJDLE1BQTdCLEM7Ozs7QUFHVnFCLHNDQUFNVSxJQUFOLENBQVc7QUFDUEMsdUNBQUdqQyxNQUFNWSxJQUFJc0IsVUFETjtBQUVQQyx1Q0FBR3BDLE1BQU1hLElBQUl3QixTQUZOO0FBR1BDLHlDQUFLcEM7QUFIRSxpQ0FBWDs7QUFNQWM7QUFDQVUsNENBQVlhLElBQVo7OztBQWRnQ3RDLHFDOzs7OztBQURBRCxxQzs7Ozs7O0FBbUJ4QztBQUNBLDhDQUFJeUIsSUFBSixDQUFTLHVDQUFUOzt1Q0FDbUIsMkJBQVlGLEtBQVosRUFBbUI7QUFDbENpQiw0REFEa0M7QUFFbENDLDRDQUFRNUIsSUFBSTZCLFFBRnNCO0FBR2xDQywyQ0FBTzdCLE1BQU02QixLQUhxQjtBQUlsQ0MsNENBQVE5QixNQUFNOEI7QUFKb0IsaUNBQW5CLEM7OztBQUFiQyxvQzs7O0FBT047QUFDTUMsc0MsR0FBU0MsT0FBT0MsSUFBUCxDQUFZSCxLQUFLSSxLQUFMLFdBQW1CcEMsSUFBSTZCLFFBQXZCLGNBQTBDLENBQTFDLENBQVosRUFBMEQsUUFBMUQsQztBQUNUUSxrQyxHQUFLcEQsV0FBV3FELE9BQVgsQ0FBbUJMLE1BQW5CLEM7QUFDTE0sa0MsR0FBS3hELEdBQUd5RCxpQkFBSCxDQUFxQm5DLE1BQXJCLEM7O0FBQ1hnQyxtQ0FBR0ksSUFBSCxDQUFRRixFQUFSOzt1Q0FDTSwrQkFBZ0JBLEVBQWhCLEM7OztpRUFFQ2xDLE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFJQW5CLFEiLCJmaWxlIjoiU3RpdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FudmFzIGZyb20gJ2NhbnZhcyc7XG5pbXBvcnQgbWVyZ2VJbWFnZXMgZnJvbSAnbWVyZ2UtaW1hZ2VzJztcbmltcG9ydCBQcm9ncmVzc0JhciBmcm9tICdhc2NpaS1wcm9ncmVzcyc7XG5pbXBvcnQgc3RyZWFtVG9Qcm9taXNlIGZyb20gJ3N0cmVhbS10by1wcm9taXNlJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpbnRvU3RyZWFtIGZyb20gJ2ludG8tc3RyZWFtJztcbmltcG9ydCBGZXRjaGVyIGZyb20gXCIuL0ZldGNoZXJcIjtcbmltcG9ydCBMb2cgZnJvbSBcIi4vTG9nXCI7XG5cbmNsYXNzIFN0aXRjaGVyIHtcbiAgICBzdGF0aWMgd3JpdGVUaWxlKHJvdywgY29sLCBidWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5qb2luKF9fZGlybmFtZSwgYC4vdGlsZXMvJHtyb3d9LSR7Y29sfS5qcGdgKTtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZShmaWxlbmFtZSwgYnVmZmVyLCBcImJpbmFyeVwiLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKHsgZmlsZW5hbWUgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlVGlsZURpcmVjdG9yeSgpIHtcbiAgICAgICAgdHJ5IHsgZnMubWtkaXJTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3RpbGVzJykpIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyci5jb2RlICE9PSAnRUVYSVNUJykgdGhyb3cgZXJyXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgYnVpbGRJbWFnZShkb2MsIGxheWVyLCBzYXZlVGlsZXMgPSBmYWxzZSkge1xuICAgICAgICBsZXQgcG9zID0gbGF5ZXIuc3RhcnR0aWxlO1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBgJHtkb2MuZmlmKDcpfS5qcGdgKTtcbiAgICAgICAgY29uc3QgdG90YWxUaWxlcyA9IGxheWVyLmNvbHMgKiAobGF5ZXIucm93cyAtIDEpO1xuICAgICAgICBjb25zdCB0aWxlcyA9IFtdO1xuXG4gICAgICAgIGlmIChzYXZlVGlsZXMpIHtcbiAgICAgICAgICAgIFN0aXRjaGVyLmNyZWF0ZVRpbGVEaXJlY3RvcnkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIExvZy5zdGVwKGBEb3dubG9hZGluZyAke3RvdGFsVGlsZXN9IHRpbGVzLi4uYCk7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gbmV3IFByb2dyZXNzQmFyKHtcbiAgICAgICAgICAgIHNjaGVtYTogJyAgICAgIDpiYXIgOmN1cnJlbnQvOnRvdGFsJyxcbiAgICAgICAgICAgIGZpbGxlZDogJ+KWiCcsXG4gICAgICAgICAgICB0b3RhbCA6IHRvdGFsVGlsZXMsXG4gICAgICAgICAgICBjbGVhcjogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRmV0Y2ggdGlsZXNcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbGF5ZXIucm93cyAtIDE7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBsYXllci5jb2xzOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYnVmZmVyIH0gPSBhd2FpdCBGZXRjaGVyLmdldFRpbGUoZG9jLCBwb3MpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNhdmVUaWxlcykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBTdGl0Y2hlci53cml0ZVRpbGUocm93LCBjb2wsIGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGlsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHg6IGNvbCAqIGRvYy50aWxlSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB5OiByb3cgKiBkb2MudGlsZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBzcmM6IGJ1ZmZlcixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLnRpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0aXRjaCB0b2dldGhlciB0aWxlc1xuICAgICAgICBMb2cuc3RlcCgnU3RpdGNoaW5nIHRvZ2V0aGVyIHRoZSBmaW5hbCBpbWFnZS4uLicpO1xuICAgICAgICBjb25zdCBiYXNlID0gYXdhaXQgbWVyZ2VJbWFnZXModGlsZXMsIHtcbiAgICAgICAgICAgIENhbnZhcyxcbiAgICAgICAgICAgIGZvcm1hdDogZG9jLm1pbWVUeXBlLFxuICAgICAgICAgICAgd2lkdGg6IGxheWVyLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBsYXllci5oZWlnaHQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNhdmUgcmVzdWx0XG4gICAgICAgIGNvbnN0IGJpdG1hcCA9IEJ1ZmZlci5mcm9tKGJhc2Uuc3BsaXQoYGRhdGE6JHtkb2MubWltZVR5cGV9O2Jhc2U2NGApWzFdLCAnYmFzZTY0Jyk7XG4gICAgICAgIGNvbnN0IHJzID0gaW50b1N0cmVhbS5kZWZhdWx0KGJpdG1hcCk7XG4gICAgICAgIGNvbnN0IHdzID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0ob3V0cHV0KTtcbiAgICAgICAgcnMucGlwZSh3cyk7XG4gICAgICAgIGF3YWl0IHN0cmVhbVRvUHJvbWlzZSh3cyk7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0aXRjaGVyO1xuIl19