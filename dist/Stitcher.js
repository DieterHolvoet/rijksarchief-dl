'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

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

                var pos, output, tiles, row, col, _ref2, buffer, base;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                pos = layer.starttile;
                                output = path.join(__dirname, doc.fif(7) + '.jpg');
                                tiles = [];


                                if (saveTiles) {
                                    Stitcher.createTileDirectory();
                                }

                                console.log('Downloading ' + layer.cols * layer.rows + ' tiles...');

                                // Fetch tiles
                                row = 0;

                            case 6:
                                if (!(row < layer.rows - 1)) {
                                    _context.next = 24;
                                    break;
                                }

                                col = 0;

                            case 8:
                                if (!(col < layer.cols)) {
                                    _context.next = 21;
                                    break;
                                }

                                _context.next = 11;
                                return _Fetcher2.default.getTile(doc, pos);

                            case 11:
                                _ref2 = _context.sent;
                                buffer = _ref2.buffer;

                                if (!saveTiles) {
                                    _context.next = 16;
                                    break;
                                }

                                _context.next = 16;
                                return Stitcher.writeTile(row, col, buffer);

                            case 16:

                                tiles.push({
                                    x: col * doc.tileHeight,
                                    y: row * doc.tileWidth,
                                    src: buffer
                                });

                                pos++;

                            case 18:
                                col++;
                                _context.next = 8;
                                break;

                            case 21:
                                row++;
                                _context.next = 6;
                                break;

                            case 24:

                                // Stitch together tiles
                                console.log('Stitching together the final image...');
                                _context.next = 27;
                                return (0, _mergeImages2.default)(tiles, {
                                    Canvas: _canvas2.default,
                                    format: doc.mimeType,
                                    width: layer.width,
                                    height: layer.height
                                });

                            case 27:
                                base = _context.sent;


                                // Save result
                                base64.decode(base.split('data:' + doc.mimeType + ';base64')[1], output, function (err) {
                                    if (err) throw err;
                                });

                                return _context.abrupt('return', output);

                            case 30:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGl0Y2hlci5qcyJdLCJuYW1lcyI6WyJmcyIsInBhdGgiLCJiYXNlNjQiLCJTdGl0Y2hlciIsInJvdyIsImNvbCIsImJ1ZmZlciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZmlsZW5hbWUiLCJqb2luIiwiX19kaXJuYW1lIiwid3JpdGVGaWxlIiwiZXJyIiwibWtkaXJTeW5jIiwiY29kZSIsImRvYyIsImxheWVyIiwic2F2ZVRpbGVzIiwicG9zIiwic3RhcnR0aWxlIiwib3V0cHV0IiwiZmlmIiwidGlsZXMiLCJjcmVhdGVUaWxlRGlyZWN0b3J5IiwiY29uc29sZSIsImxvZyIsImNvbHMiLCJyb3dzIiwiZ2V0VGlsZSIsIndyaXRlVGlsZSIsInB1c2giLCJ4IiwidGlsZUhlaWdodCIsInkiLCJ0aWxlV2lkdGgiLCJzcmMiLCJDYW52YXMiLCJmb3JtYXQiLCJtaW1lVHlwZSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFzZSIsImRlY29kZSIsInNwbGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUEsRTs7QUFDWjs7SUFBWUMsSTs7QUFDWjs7SUFBWUMsTTs7QUFDWjs7Ozs7Ozs7Ozs7O0lBRU1DLFE7Ozs7Ozs7a0NBQ2VDLEcsRUFBS0MsRyxFQUFLQyxNLEVBQVE7QUFDL0IsbUJBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQyxvQkFBTUMsV0FBV1QsS0FBS1UsSUFBTCxDQUFVQyxTQUFWLGVBQWdDUixHQUFoQyxTQUF1Q0MsR0FBdkMsVUFBakI7QUFDQUwsbUJBQUdhLFNBQUgsQ0FBYUgsUUFBYixFQUF1QkosTUFBdkIsRUFBK0IsUUFBL0IsRUFBeUMsVUFBVVEsR0FBVixFQUFlO0FBQ3BELHdCQUFJQSxHQUFKLEVBQVNMLE9BQU9LLEdBQVAsRUFBVCxLQUNLTixRQUFRLEVBQUVFLGtCQUFGLEVBQVI7QUFDUixpQkFIRDtBQUlILGFBTk0sQ0FBUDtBQU9IOzs7OENBRTRCO0FBQ3pCLGdCQUFJO0FBQUVWLG1CQUFHZSxTQUFILENBQWFkLEtBQUtVLElBQUwsQ0FBVUMsU0FBVixFQUFxQixTQUFyQixDQUFiO0FBQStDLGFBQXJELENBQXNELE9BQU9FLEdBQVAsRUFBWTtBQUM5RCxvQkFBSUEsSUFBSUUsSUFBSixLQUFhLFFBQWpCLEVBQTJCLE1BQU1GLEdBQU47QUFDOUI7QUFDSjs7OztrRkFFdUJHLEcsRUFBS0MsSztvQkFBT0MsUyx1RUFBWSxLOzs7Ozs7OztBQUN4Q0MsbUMsR0FBTUYsTUFBTUcsUztBQUNWQyxzQyxHQUFTckIsS0FBS1UsSUFBTCxDQUFVQyxTQUFWLEVBQXdCSyxJQUFJTSxHQUFKLENBQVEsQ0FBUixDQUF4QixVO0FBQ1RDLHFDLEdBQVEsRTs7O0FBRWQsb0NBQUlMLFNBQUosRUFBZTtBQUNYaEIsNkNBQVNzQixtQkFBVDtBQUNIOztBQUVEQyx3Q0FBUUMsR0FBUixrQkFBMkJULE1BQU1VLElBQU4sR0FBYVYsTUFBTVcsSUFBOUM7O0FBRUE7QUFDU3pCLG1DLEdBQU0sQzs7O3NDQUFHQSxNQUFNYyxNQUFNVyxJQUFOLEdBQWEsQzs7Ozs7QUFDeEJ4QixtQyxHQUFNLEM7OztzQ0FBR0EsTUFBTWEsTUFBTVUsSTs7Ozs7O3VDQUNELGtCQUFRRSxPQUFSLENBQWdCYixHQUFoQixFQUFxQkcsR0FBckIsQzs7OztBQUFqQmQsc0MsU0FBQUEsTTs7cUNBRUphLFM7Ozs7Ozt1Q0FDTWhCLFNBQVM0QixTQUFULENBQW1CM0IsR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxNQUE3QixDOzs7O0FBR1ZrQixzQ0FBTVEsSUFBTixDQUFXO0FBQ1BDLHVDQUFHNUIsTUFBTVksSUFBSWlCLFVBRE47QUFFUEMsdUNBQUcvQixNQUFNYSxJQUFJbUIsU0FGTjtBQUdQQyx5Q0FBSy9CO0FBSEUsaUNBQVg7O0FBTUFjOzs7QUFiZ0NmLHFDOzs7OztBQURBRCxxQzs7Ozs7O0FBa0J4QztBQUNBc0Isd0NBQVFDLEdBQVIsQ0FBWSx1Q0FBWjs7dUNBQ21CLDJCQUFZSCxLQUFaLEVBQW1CO0FBQ2xDYyw0REFEa0M7QUFFbENDLDRDQUFRdEIsSUFBSXVCLFFBRnNCO0FBR2xDQywyQ0FBT3ZCLE1BQU11QixLQUhxQjtBQUlsQ0MsNENBQVF4QixNQUFNd0I7QUFKb0IsaUNBQW5CLEM7OztBQUFiQyxvQzs7O0FBT047QUFDQXpDLHVDQUFPMEMsTUFBUCxDQUNJRCxLQUFLRSxLQUFMLFdBQW1CNUIsSUFBSXVCLFFBQXZCLGNBQTBDLENBQTFDLENBREosRUFFSWxCLE1BRkosRUFHSSxVQUFDUixHQUFELEVBQVM7QUFDTCx3Q0FBSUEsR0FBSixFQUFTLE1BQU1BLEdBQU47QUFDWixpQ0FMTDs7aUVBUU9RLE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFJQW5CLFEiLCJmaWxlIjoiU3RpdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVyZ2VJbWFnZXMgZnJvbSAnbWVyZ2UtaW1hZ2VzJztcbmltcG9ydCBDYW52YXMgZnJvbSAnY2FudmFzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBiYXNlNjQgZnJvbSAnZmlsZS1iYXNlNjQnO1xuaW1wb3J0IEZldGNoZXIgZnJvbSBcIi4vRmV0Y2hlclwiO1xuXG5jbGFzcyBTdGl0Y2hlciB7XG4gICAgc3RhdGljIHdyaXRlVGlsZShyb3csIGNvbCwgYnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsIGAuL3RpbGVzLyR7cm93fS0ke2NvbH0uanBnYCk7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGUoZmlsZW5hbWUsIGJ1ZmZlciwgXCJiaW5hcnlcIiwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIGVsc2UgcmVzb2x2ZSh7IGZpbGVuYW1lIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVRpbGVEaXJlY3RvcnkoKSB7XG4gICAgICAgIHRyeSB7IGZzLm1rZGlyU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi90aWxlcycpKSB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIuY29kZSAhPT0gJ0VFWElTVCcpIHRocm93IGVyclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGJ1aWxkSW1hZ2UoZG9jLCBsYXllciwgc2F2ZVRpbGVzID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHBvcyA9IGxheWVyLnN0YXJ0dGlsZTtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgYCR7ZG9jLmZpZig3KX0uanBnYCk7XG4gICAgICAgIGNvbnN0IHRpbGVzID0gW107XG5cbiAgICAgICAgaWYgKHNhdmVUaWxlcykge1xuICAgICAgICAgICAgU3RpdGNoZXIuY3JlYXRlVGlsZURpcmVjdG9yeSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYERvd25sb2FkaW5nICR7bGF5ZXIuY29scyAqIGxheWVyLnJvd3N9IHRpbGVzLi4uYCk7XG5cbiAgICAgICAgLy8gRmV0Y2ggdGlsZXNcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbGF5ZXIucm93cyAtIDE7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBsYXllci5jb2xzOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYnVmZmVyIH0gPSBhd2FpdCBGZXRjaGVyLmdldFRpbGUoZG9jLCBwb3MpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNhdmVUaWxlcykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBTdGl0Y2hlci53cml0ZVRpbGUocm93LCBjb2wsIGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGlsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHg6IGNvbCAqIGRvYy50aWxlSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB5OiByb3cgKiBkb2MudGlsZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBzcmM6IGJ1ZmZlcixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RpdGNoIHRvZ2V0aGVyIHRpbGVzXG4gICAgICAgIGNvbnNvbGUubG9nKCdTdGl0Y2hpbmcgdG9nZXRoZXIgdGhlIGZpbmFsIGltYWdlLi4uJyk7XG4gICAgICAgIGNvbnN0IGJhc2UgPSBhd2FpdCBtZXJnZUltYWdlcyh0aWxlcywge1xuICAgICAgICAgICAgQ2FudmFzLFxuICAgICAgICAgICAgZm9ybWF0OiBkb2MubWltZVR5cGUsXG4gICAgICAgICAgICB3aWR0aDogbGF5ZXIud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGxheWVyLmhlaWdodCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2F2ZSByZXN1bHRcbiAgICAgICAgYmFzZTY0LmRlY29kZShcbiAgICAgICAgICAgIGJhc2Uuc3BsaXQoYGRhdGE6JHtkb2MubWltZVR5cGV9O2Jhc2U2NGApWzFdLFxuICAgICAgICAgICAgb3V0cHV0LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RpdGNoZXI7XG4iXX0=