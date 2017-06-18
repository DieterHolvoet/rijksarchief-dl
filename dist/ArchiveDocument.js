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
        key: "withUrl",
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
                var instance;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _Log2.default.step('Fetching info about image...');
                                instance = new this();

                                instance.fifs = ArchiveDocument.parseUrl(url);
                                _context.t0 = Object;
                                _context.t1 = instance;
                                _context.next = 7;
                                return _Fetcher2.default.getMeta(instance);

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

            function withUrl(_x) {
                return _ref.apply(this, arguments);
            }

            return withUrl;
        }()

        /**
         * Extract the required parts from the URL
         * @param val
         * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
         */

    }, {
        key: "parseUrl",
        value: function parseUrl(val) {
            var result = Array.from(/([0-9]{3})_([0-9]{4})_([0-9]{3})_([0-9]{5})_([0-9]{3})_([0-9]{1})_([0-9]{4})/.exec(val));
            result.shift();
            return result;
        }
    }]);

    return ArchiveDocument;
}();

exports.default = ArchiveDocument;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BcmNoaXZlRG9jdW1lbnQuanMiXSwibmFtZXMiOlsiQXJjaGl2ZURvY3VtZW50IiwibnVtIiwiZmlmcyIsImxlbmd0aCIsImpvaW4iLCJ1cmwiLCJzdGVwIiwiaW5zdGFuY2UiLCJwYXJzZVVybCIsIk9iamVjdCIsImdldE1ldGEiLCJhc3NpZ24iLCJ2YWwiLCJyZXN1bHQiLCJBcnJheSIsImZyb20iLCJleGVjIiwic2hpZnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLGU7Ozs7Ozs7NEJBb0JFQyxHLEVBQUs7QUFDTCxnQkFBTUMsb0NBQVcsS0FBS0EsSUFBaEIsRUFBTjtBQUNBQSxpQkFBS0MsTUFBTCxJQUFnQkQsS0FBS0MsTUFBTCxHQUFjRixHQUE5QjtBQUNBLG1CQUFPQyxLQUFLRSxJQUFMLENBQVUsR0FBVixDQUFQO0FBQ0g7Ozs7a0ZBdkJvQkMsRzs7Ozs7O0FBQ2pCLDhDQUFJQyxJQUFKLENBQVMsOEJBQVQ7QUFDTUMsd0MsR0FBVyxJQUFJLElBQUosRTs7QUFDakJBLHlDQUFTTCxJQUFULEdBQWdCRixnQkFBZ0JRLFFBQWhCLENBQXlCSCxHQUF6QixDQUFoQjs4Q0FDQUksTTs4Q0FBY0YsUTs7dUNBQWdCLGtCQUFRRyxPQUFSLENBQWdCSCxRQUFoQixDOzs7Ozs0Q0FBdkJJLE07O2lFQUNBSixROzs7Ozs7Ozs7Ozs7Ozs7OztBQUdYOzs7Ozs7OztpQ0FLZ0JLLEcsRUFBSztBQUNqQixnQkFBTUMsU0FBU0MsTUFBTUMsSUFBTixDQUFXLCtFQUErRUMsSUFBL0UsQ0FBb0ZKLEdBQXBGLENBQVgsQ0FBZjtBQUNBQyxtQkFBT0ksS0FBUDtBQUNBLG1CQUFPSixNQUFQO0FBQ0g7Ozs7OztrQkFTVWIsZSIsImZpbGUiOiJBcmNoaXZlRG9jdW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRmV0Y2hlciBmcm9tIFwiLi9GZXRjaGVyXCI7XG5pbXBvcnQgTG9nIGZyb20gXCIuL0xvZ1wiO1xuXG5jbGFzcyBBcmNoaXZlRG9jdW1lbnQge1xuICAgIHN0YXRpYyBhc3luYyB3aXRoVXJsKHVybCkge1xuICAgICAgICBMb2cuc3RlcCgnRmV0Y2hpbmcgaW5mbyBhYm91dCBpbWFnZS4uLicpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzO1xuICAgICAgICBpbnN0YW5jZS5maWZzID0gQXJjaGl2ZURvY3VtZW50LnBhcnNlVXJsKHVybCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIGF3YWl0IEZldGNoZXIuZ2V0TWV0YShpbnN0YW5jZSkpO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCB0aGUgcmVxdWlyZWQgcGFydHMgZnJvbSB0aGUgVVJMXG4gICAgICogQHBhcmFtIHZhbFxuICAgICAqIEBleGFtcGxlIGh0dHA6Ly9zZWFyY2guYXJjaC5iZS9pbWFnZXNlcnZlci9nZXRwaWMucGhwPzUxMC81MTBfMTU0Nl8wMDAvNTEwXzE1NDZfMDAwXzAxODUyXzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwXzBfMDAwMS5qcDImMjQ5XG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlVXJsKHZhbCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBBcnJheS5mcm9tKC8oWzAtOV17M30pXyhbMC05XXs0fSlfKFswLTldezN9KV8oWzAtOV17NX0pXyhbMC05XXszfSlfKFswLTldezF9KV8oWzAtOV17NH0pLy5leGVjKHZhbCkpO1xuICAgICAgICByZXN1bHQuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmaWYobnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZnMgPSBbLi4udGhpcy5maWZzXTtcbiAgICAgICAgZmlmcy5sZW5ndGggLT0gKGZpZnMubGVuZ3RoIC0gbnVtKTtcbiAgICAgICAgcmV0dXJuIGZpZnMuam9pbignXycpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXJjaGl2ZURvY3VtZW50O1xuIl19