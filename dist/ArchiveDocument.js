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
                                _Log2.default.step('Fetching info about image...');
                                instance = new this();

                                instance.fifs = ArchiveDocument.parseUrl(url);
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
            var result = /([0-9]{3})_([0-9]{4})_([0-9]{3})_([0-9]{5})_([0-9]{3})_([0-9]{1})_([0-9]{4})/.exec(val);
            if (!result) {
                throw new Error('Error while parsing the url: no document ID found.');
            }

            var values = Array.from(result);
            values.shift();
            return values;
        }
    }]);

    return ArchiveDocument;
}();

exports.default = ArchiveDocument;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BcmNoaXZlRG9jdW1lbnQuanMiXSwibmFtZXMiOlsiQXJjaGl2ZURvY3VtZW50IiwibnVtIiwiZmlmcyIsImxlbmd0aCIsImpvaW4iLCJ1cmwiLCJzY2FsZUZhY3RvciIsInN0ZXAiLCJpbnN0YW5jZSIsInBhcnNlVXJsIiwiT2JqZWN0IiwiZ2V0TWV0YSIsImFzc2lnbiIsInZhbCIsInJlc3VsdCIsImV4ZWMiLCJFcnJvciIsInZhbHVlcyIsIkFycmF5IiwiZnJvbSIsInNoaWZ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxlOzs7Ozs7OzRCQXlCRUMsRyxFQUFLO0FBQ0wsZ0JBQU1DLG9DQUFXLEtBQUtBLElBQWhCLEVBQU47QUFDQUEsaUJBQUtDLE1BQUwsSUFBZ0JELEtBQUtDLE1BQUwsR0FBY0YsR0FBOUI7QUFDQSxtQkFBT0MsS0FBS0UsSUFBTCxDQUFVLEdBQVYsQ0FBUDtBQUNIOzs7O2tGQTVCbUJDLEcsRUFBS0MsVzs7Ozs7O0FBQ3JCLDhDQUFJQyxJQUFKLENBQVMsOEJBQVQ7QUFDTUMsd0MsR0FBVyxJQUFJLElBQUosRTs7QUFDakJBLHlDQUFTTixJQUFULEdBQWdCRixnQkFBZ0JTLFFBQWhCLENBQXlCSixHQUF6QixDQUFoQjs4Q0FDQUssTTs4Q0FBY0YsUTs7dUNBQWdCLGtCQUFRRyxPQUFSLENBQWdCSCxRQUFoQixFQUEwQkYsV0FBMUIsQzs7Ozs7NENBQXZCTSxNOztpRUFDQUosUTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHWDs7Ozs7Ozs7aUNBS2dCSyxHLEVBQUs7QUFDakIsZ0JBQU1DLFNBQVMsK0VBQStFQyxJQUEvRSxDQUFvRkYsR0FBcEYsQ0FBZjtBQUNBLGdCQUFJLENBQUNDLE1BQUwsRUFBYTtBQUNULHNCQUFNLElBQUlFLEtBQUosQ0FBVSxvREFBVixDQUFOO0FBQ0g7O0FBRUQsZ0JBQU1DLFNBQVNDLE1BQU1DLElBQU4sQ0FBV0wsTUFBWCxDQUFmO0FBQ0FHLG1CQUFPRyxLQUFQO0FBQ0EsbUJBQU9ILE1BQVA7QUFDSDs7Ozs7O2tCQVNVakIsZSIsImZpbGUiOiJBcmNoaXZlRG9jdW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRmV0Y2hlciBmcm9tIFwiLi9GZXRjaGVyXCI7XG5pbXBvcnQgTG9nIGZyb20gXCIuL0xvZ1wiO1xuXG5jbGFzcyBBcmNoaXZlRG9jdW1lbnQge1xuICAgIHN0YXRpYyBhc3luYyBjcmVhdGUodXJsLCBzY2FsZUZhY3Rvcikge1xuICAgICAgICBMb2cuc3RlcCgnRmV0Y2hpbmcgaW5mbyBhYm91dCBpbWFnZS4uLicpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzO1xuICAgICAgICBpbnN0YW5jZS5maWZzID0gQXJjaGl2ZURvY3VtZW50LnBhcnNlVXJsKHVybCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIGF3YWl0IEZldGNoZXIuZ2V0TWV0YShpbnN0YW5jZSwgc2NhbGVGYWN0b3IpKTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgdGhlIHJlcXVpcmVkIHBhcnRzIGZyb20gdGhlIFVSTFxuICAgICAqIEBwYXJhbSB2YWxcbiAgICAgKiBAZXhhbXBsZSBodHRwOi8vc2VhcmNoLmFyY2guYmUvaW1hZ2VzZXJ2ZXIvZ2V0cGljLnBocD81MTAvNTEwXzE1NDZfMDAwLzUxMF8xNTQ2XzAwMF8wMTg1Ml8wMDAvNTEwXzE1NDZfMDAwXzAxODUyXzAwMF8wXzAwMDEuanAyJjI0OVxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZVVybCh2YWwpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gLyhbMC05XXszfSlfKFswLTldezR9KV8oWzAtOV17M30pXyhbMC05XXs1fSlfKFswLTldezN9KV8oWzAtOV17MX0pXyhbMC05XXs0fSkvLmV4ZWModmFsKTtcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3Igd2hpbGUgcGFyc2luZyB0aGUgdXJsOiBubyBkb2N1bWVudCBJRCBmb3VuZC4nKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gQXJyYXkuZnJvbShyZXN1bHQpO1xuICAgICAgICB2YWx1ZXMuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICBmaWYobnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZnMgPSBbLi4udGhpcy5maWZzXTtcbiAgICAgICAgZmlmcy5sZW5ndGggLT0gKGZpZnMubGVuZ3RoIC0gbnVtKTtcbiAgICAgICAgcmV0dXJuIGZpZnMuam9pbignXycpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXJjaGl2ZURvY3VtZW50O1xuIl19