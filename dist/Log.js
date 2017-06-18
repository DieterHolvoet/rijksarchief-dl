'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stepCount = 0;
var totalSteps = 3;

var Log = function () {
    function Log() {
        _classCallCheck(this, Log);
    }

    _createClass(Log, null, [{
        key: 'info',
        value: function info(msg) {
            console.log(_chalk2.default.blue('info') + ' ' + msg);
        }
    }, {
        key: 'warning',
        value: function warning(msg) {
            console.warn(_chalk2.default.yellow('warning') + ' ' + msg);
        }
    }, {
        key: 'error',
        value: function error(msg) {
            console.error(_chalk2.default.red('error') + ' ' + msg);
        }
    }, {
        key: 'success',
        value: function success(msg) {
            console.log(_chalk2.default.green('success') + ' ' + msg);
        }
    }, {
        key: 'step',
        value: function step(msg) {
            stepCount++;
            console.log('[' + stepCount + '/' + totalSteps + '] ' + msg);
        }
    }]);

    return Log;
}();

exports.default = Log;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2cuanMiXSwibmFtZXMiOlsic3RlcENvdW50IiwidG90YWxTdGVwcyIsIkxvZyIsIm1zZyIsImNvbnNvbGUiLCJsb2ciLCJibHVlIiwid2FybiIsInllbGxvdyIsImVycm9yIiwicmVkIiwiZ3JlZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUEsSUFBSUEsWUFBWSxDQUFoQjtBQUNBLElBQUlDLGFBQWEsQ0FBakI7O0lBRU1DLEc7Ozs7Ozs7NkJBQ1VDLEcsRUFBSztBQUNiQyxvQkFBUUMsR0FBUixDQUFlLGdCQUFNQyxJQUFOLENBQVcsTUFBWCxDQUFmLFNBQXFDSCxHQUFyQztBQUNIOzs7Z0NBRWNBLEcsRUFBSztBQUNoQkMsb0JBQVFHLElBQVIsQ0FBZ0IsZ0JBQU1DLE1BQU4sQ0FBYSxTQUFiLENBQWhCLFNBQTJDTCxHQUEzQztBQUNIOzs7OEJBRVlBLEcsRUFBSztBQUNkQyxvQkFBUUssS0FBUixDQUFpQixnQkFBTUMsR0FBTixDQUFVLE9BQVYsQ0FBakIsU0FBdUNQLEdBQXZDO0FBQ0g7OztnQ0FFY0EsRyxFQUFLO0FBQ2hCQyxvQkFBUUMsR0FBUixDQUFlLGdCQUFNTSxLQUFOLENBQVksU0FBWixDQUFmLFNBQXlDUixHQUF6QztBQUNIOzs7NkJBRVdBLEcsRUFBSztBQUNiSDtBQUNBSSxvQkFBUUMsR0FBUixPQUFnQkwsU0FBaEIsU0FBNkJDLFVBQTdCLFVBQTRDRSxHQUE1QztBQUNIOzs7Ozs7a0JBR1VELEciLCJmaWxlIjoiTG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJ1xuXG5sZXQgc3RlcENvdW50ID0gMDtcbmxldCB0b3RhbFN0ZXBzID0gMztcblxuY2xhc3MgTG9nIHtcbiAgICBzdGF0aWMgaW5mbyhtc2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7Y2hhbGsuYmx1ZSgnaW5mbycpfSAke21zZ31gKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgd2FybmluZyhtc2cpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGAke2NoYWxrLnllbGxvdygnd2FybmluZycpfSAke21zZ31gKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZXJyb3IobXNnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7Y2hhbGsucmVkKCdlcnJvcicpfSAke21zZ31gKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3VjY2Vzcyhtc2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7Y2hhbGsuZ3JlZW4oJ3N1Y2Nlc3MnKX0gJHttc2d9YCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0ZXAobXNnKSB7XG4gICAgICAgIHN0ZXBDb3VudCsrO1xuICAgICAgICBjb25zb2xlLmxvZyhgWyR7c3RlcENvdW50fS8ke3RvdGFsU3RlcHN9XSAke21zZ31gKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZztcbiJdfQ==