"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Fetcher = require("./Fetcher");

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _Log = require("./Log");

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArchiveDocument = function () {
    function ArchiveDocument() {
        _classCallCheck(this, ArchiveDocument);
    }

    _createClass(ArchiveDocument, [{
        key: "fif",
        value: function fif(num) {
            var fifs = [].concat(_toConsumableArray(this.fifs));
            fifs.length -= fifs.length - num;
            return fifs.join('_');
        }
    }], [{
        key: "create",
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url, scaleFactor) {
                var instance;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                instance = new this();

                                _Log2.default.step('Fetching info about image...');
                                Object.assign(instance, ArchiveDocument.parseUrl(url));
                                _context.t0 = Object;
                                _context.t1 = instance;
                                _context.next = 7;
                                return _Fetcher2.default.getMeta(instance, scaleFactor);

                            case 7:
                                _context.t2 = _context.sent;

                                _context.t0.assign.call(_context.t0, _context.t1, _context.t2);

                                return _context.abrupt("return", instance);

                            case 10:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function create(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return create;
        }()

        /**
         * Extract the required parts from the URL
         * @param val
         * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
         */

    }, {
        key: "parseUrl",
        value: function parseUrl(val) {
            var result = /([0-9]{3})_([0-9]{4})_([0-9]{3})_([0-9]{5})_([0-9]{3})_([0-9]{1})_([0-9]{4})\.?([a-zA-Z0-9]+)?/.exec(val);
            if (!result) {
                throw new Error('Error while parsing the url: no document ID found.');
            }

            var fifs = Array.from(result);
            fifs.shift();

            var extension = fifs.pop() || 'jp2';

            return { fifs: fifs, extension: extension };
        }
    }]);

    return ArchiveDocument;
}();

exports.default = ArchiveDocument;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BcmNoaXZlRG9jdW1lbnQuanMiXSwibmFtZXMiOlsiQXJjaGl2ZURvY3VtZW50IiwibnVtIiwiZmlmcyIsImxlbmd0aCIsImpvaW4iLCJ1cmwiLCJzY2FsZUZhY3RvciIsImluc3RhbmNlIiwic3RlcCIsIk9iamVjdCIsImFzc2lnbiIsInBhcnNlVXJsIiwiZ2V0TWV0YSIsInZhbCIsInJlc3VsdCIsImV4ZWMiLCJFcnJvciIsIkFycmF5IiwiZnJvbSIsInNoaWZ0IiwiZXh0ZW5zaW9uIiwicG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxlOzs7Ozs7OzRCQTRCRUMsRyxFQUFLO0FBQ0wsZ0JBQU1DLG9DQUFXLEtBQUtBLElBQWhCLEVBQU47QUFDQUEsaUJBQUtDLE1BQUwsSUFBZ0JELEtBQUtDLE1BQUwsR0FBY0YsR0FBOUI7QUFDQSxtQkFBT0MsS0FBS0UsSUFBTCxDQUFVLEdBQVYsQ0FBUDtBQUNIOzs7O2tGQS9CbUJDLEcsRUFBS0MsVzs7Ozs7O0FBQ2ZDLHdDLEdBQVcsSUFBSSxJQUFKLEU7O0FBQ2pCLDhDQUFJQyxJQUFKLENBQVMsOEJBQVQ7QUFDQUMsdUNBQU9DLE1BQVAsQ0FBY0gsUUFBZCxFQUF3QlAsZ0JBQWdCVyxRQUFoQixDQUF5Qk4sR0FBekIsQ0FBeEI7OENBQ0FJLE07OENBQWNGLFE7O3VDQUFnQixrQkFBUUssT0FBUixDQUFnQkwsUUFBaEIsRUFBMEJELFdBQTFCLEM7Ozs7OzRDQUF2QkksTTs7aUVBQ0FILFE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR1g7Ozs7Ozs7O2lDQUtnQk0sRyxFQUFLO0FBQ2pCLGdCQUFNQyxTQUFTLGlHQUFpR0MsSUFBakcsQ0FBc0dGLEdBQXRHLENBQWY7QUFDQSxnQkFBSSxDQUFDQyxNQUFMLEVBQWE7QUFDVCxzQkFBTSxJQUFJRSxLQUFKLENBQVUsb0RBQVYsQ0FBTjtBQUNIOztBQUVELGdCQUFNZCxPQUFPZSxNQUFNQyxJQUFOLENBQVdKLE1BQVgsQ0FBYjtBQUNBWixpQkFBS2lCLEtBQUw7O0FBRUEsZ0JBQU1DLFlBQVlsQixLQUFLbUIsR0FBTCxNQUFjLEtBQWhDOztBQUVBLG1CQUFPLEVBQUVuQixVQUFGLEVBQVFrQixvQkFBUixFQUFQO0FBQ0g7Ozs7OztrQkFTVXBCLGUiLCJmaWxlIjoiQXJjaGl2ZURvY3VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEZldGNoZXIgZnJvbSBcIi4vRmV0Y2hlclwiO1xuaW1wb3J0IExvZyBmcm9tIFwiLi9Mb2dcIjtcblxuY2xhc3MgQXJjaGl2ZURvY3VtZW50IHtcbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlKHVybCwgc2NhbGVGYWN0b3IpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgdGhpcztcbiAgICAgICAgTG9nLnN0ZXAoJ0ZldGNoaW5nIGluZm8gYWJvdXQgaW1hZ2UuLi4nKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgQXJjaGl2ZURvY3VtZW50LnBhcnNlVXJsKHVybCkpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBhd2FpdCBGZXRjaGVyLmdldE1ldGEoaW5zdGFuY2UsIHNjYWxlRmFjdG9yKSk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IHRoZSByZXF1aXJlZCBwYXJ0cyBmcm9tIHRoZSBVUkxcbiAgICAgKiBAcGFyYW0gdmFsXG4gICAgICogQGV4YW1wbGUgaHR0cDovL3NlYXJjaC5hcmNoLmJlL2ltYWdlc2VydmVyL2dldHBpYy5waHA/NTEwLzUxMF8xNTQ2XzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDBfMF8wMDAxLmpwMiYyNDlcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VVcmwodmFsKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IC8oWzAtOV17M30pXyhbMC05XXs0fSlfKFswLTldezN9KV8oWzAtOV17NX0pXyhbMC05XXszfSlfKFswLTldezF9KV8oWzAtOV17NH0pXFwuPyhbYS16QS1aMC05XSspPy8uZXhlYyh2YWwpO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciB3aGlsZSBwYXJzaW5nIHRoZSB1cmw6IG5vIGRvY3VtZW50IElEIGZvdW5kLicpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWZzID0gQXJyYXkuZnJvbShyZXN1bHQpO1xuICAgICAgICBmaWZzLnNoaWZ0KCk7XG5cbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gZmlmcy5wb3AoKSB8fCAnanAyJztcblxuICAgICAgICByZXR1cm4geyBmaWZzLCBleHRlbnNpb24gfTtcbiAgICB9XG5cbiAgICBmaWYobnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZnMgPSBbLi4udGhpcy5maWZzXTtcbiAgICAgICAgZmlmcy5sZW5ndGggLT0gKGZpZnMubGVuZ3RoIC0gbnVtKTtcbiAgICAgICAgcmV0dXJuIGZpZnMuam9pbignXycpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXJjaGl2ZURvY3VtZW50O1xuIl19