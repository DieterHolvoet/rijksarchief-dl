"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Fetcher = require("./Fetcher");

var _Fetcher2 = _interopRequireDefault(_Fetcher);

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
                                instance = new this();

                                instance.fifs = ArchiveDocument.parseUrl(url);
                                _context.t0 = Object;
                                _context.t1 = instance;
                                _context.next = 6;
                                return _Fetcher2.default.getMeta(instance);

                            case 6:
                                _context.t2 = _context.sent;

                                _context.t0.assign.call(_context.t0, _context.t1, _context.t2);

                                return _context.abrupt("return", instance);

                            case 9:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BcmNoaXZlRG9jdW1lbnQuanMiXSwibmFtZXMiOlsiQXJjaGl2ZURvY3VtZW50IiwibnVtIiwiZmlmcyIsImxlbmd0aCIsImpvaW4iLCJ1cmwiLCJpbnN0YW5jZSIsInBhcnNlVXJsIiwiT2JqZWN0IiwiZ2V0TWV0YSIsImFzc2lnbiIsInZhbCIsInJlc3VsdCIsIkFycmF5IiwiZnJvbSIsImV4ZWMiLCJzaGlmdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLGU7Ozs7Ozs7NEJBbUJFQyxHLEVBQUs7QUFDTCxnQkFBTUMsb0NBQVcsS0FBS0EsSUFBaEIsRUFBTjtBQUNBQSxpQkFBS0MsTUFBTCxJQUFnQkQsS0FBS0MsTUFBTCxHQUFjRixHQUE5QjtBQUNBLG1CQUFPQyxLQUFLRSxJQUFMLENBQVUsR0FBVixDQUFQO0FBQ0g7Ozs7a0ZBdEJvQkMsRzs7Ozs7O0FBQ1hDLHdDLEdBQVcsSUFBSSxJQUFKLEU7O0FBQ2pCQSx5Q0FBU0osSUFBVCxHQUFnQkYsZ0JBQWdCTyxRQUFoQixDQUF5QkYsR0FBekIsQ0FBaEI7OENBQ0FHLE07OENBQWNGLFE7O3VDQUFnQixrQkFBUUcsT0FBUixDQUFnQkgsUUFBaEIsQzs7Ozs7NENBQXZCSSxNOztpRUFDQUosUTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHWDs7Ozs7Ozs7aUNBS2dCSyxHLEVBQUs7QUFDakIsZ0JBQU1DLFNBQVNDLE1BQU1DLElBQU4sQ0FBVywrRUFBK0VDLElBQS9FLENBQW9GSixHQUFwRixDQUFYLENBQWY7QUFDQUMsbUJBQU9JLEtBQVA7QUFDQSxtQkFBT0osTUFBUDtBQUNIOzs7Ozs7a0JBU1VaLGUiLCJmaWxlIjoiQXJjaGl2ZURvY3VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEZldGNoZXIgZnJvbSBcIi4vRmV0Y2hlclwiO1xuXG5jbGFzcyBBcmNoaXZlRG9jdW1lbnQge1xuICAgIHN0YXRpYyBhc3luYyB3aXRoVXJsKHVybCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzO1xuICAgICAgICBpbnN0YW5jZS5maWZzID0gQXJjaGl2ZURvY3VtZW50LnBhcnNlVXJsKHVybCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIGF3YWl0IEZldGNoZXIuZ2V0TWV0YShpbnN0YW5jZSkpO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCB0aGUgcmVxdWlyZWQgcGFydHMgZnJvbSB0aGUgVVJMXG4gICAgICogQHBhcmFtIHZhbFxuICAgICAqIEBleGFtcGxlIGh0dHA6Ly9zZWFyY2guYXJjaC5iZS9pbWFnZXNlcnZlci9nZXRwaWMucGhwPzUxMC81MTBfMTU0Nl8wMDAvNTEwXzE1NDZfMDAwXzAxODUyXzAwMC81MTBfMTU0Nl8wMDBfMDE4NTJfMDAwXzBfMDAwMS5qcDImMjQ5XG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlVXJsKHZhbCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBBcnJheS5mcm9tKC8oWzAtOV17M30pXyhbMC05XXs0fSlfKFswLTldezN9KV8oWzAtOV17NX0pXyhbMC05XXszfSlfKFswLTldezF9KV8oWzAtOV17NH0pLy5leGVjKHZhbCkpO1xuICAgICAgICByZXN1bHQuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmaWYobnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZnMgPSBbLi4udGhpcy5maWZzXTtcbiAgICAgICAgZmlmcy5sZW5ndGggLT0gKGZpZnMubGVuZ3RoIC0gbnVtKTtcbiAgICAgICAgcmV0dXJuIGZpZnMuam9pbignXycpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXJjaGl2ZURvY3VtZW50O1xuIl19