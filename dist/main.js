#! /usr/bin/env node
'use strict';

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ArchiveDocument = require('./ArchiveDocument');

var _ArchiveDocument2 = _interopRequireDefault(_ArchiveDocument);

var _Stitcher = require('./Stitcher');

var _Stitcher2 = _interopRequireDefault(_Stitcher);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('1.0').option('-u, --url [url]', 'the url of the resource (required)').option('-s, --scale-factor [scale]', 'the size of the output image (options: 1,2,4,8,16,32) [default: 1]', 32).option('-t, --save-tiles [sav]', 'save the separate tiles (default: false)', false).option('-o, --open-image [open]', 'open the image after saving (default: true)', true).parse(process.argv);

var url = _commander2.default.url,
    scaleFactor = _commander2.default.scaleFactor,
    saveTiles = _commander2.default.saveTiles,
    openImage = _commander2.default.openImage;


if (!url) {
    _commander2.default.help();
}

_ArchiveDocument2.default.create(url, scaleFactor).then(function (doc) {
    return _Stitcher2.default.buildImage(doc, saveTiles);
}).then(function (output) {
    _Log2.default.success('Stitching complete!');
    _Log2.default.success('Image was saved at ' + _chalk2.default.blue(output) + (openImage ? ' and will be opened any moment.' : ''));
    if (openImage) {
        (0, _opn2.default)(output);
    }
    return Promise.resolve();
}).catch(function (error) {
    return _Log2.default.error(error.message);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInZlcnNpb24iLCJvcHRpb24iLCJwYXJzZSIsInByb2Nlc3MiLCJhcmd2IiwidXJsIiwic2NhbGVGYWN0b3IiLCJzYXZlVGlsZXMiLCJvcGVuSW1hZ2UiLCJoZWxwIiwiY3JlYXRlIiwidGhlbiIsImRvYyIsImJ1aWxkSW1hZ2UiLCJvdXRwdXQiLCJzdWNjZXNzIiwiYmx1ZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiY2F0Y2giLCJlcnJvciIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxvQkFDS0EsT0FETCxDQUNhLEtBRGIsRUFFS0MsTUFGTCxDQUVZLGlCQUZaLEVBRStCLG9DQUYvQixFQUdLQSxNQUhMLENBR1ksNEJBSFosRUFHMEMsb0VBSDFDLEVBR2dILEVBSGhILEVBSUtBLE1BSkwsQ0FJWSx3QkFKWixFQUlzQywwQ0FKdEMsRUFJa0YsS0FKbEYsRUFLS0EsTUFMTCxDQUtZLHlCQUxaLEVBS3VDLDZDQUx2QyxFQUtzRixJQUx0RixFQU1LQyxLQU5MLENBTVdDLFFBQVFDLElBTm5COztJQVFRQyxHLHVCQUFBQSxHO0lBQUtDLFcsdUJBQUFBLFc7SUFBYUMsUyx1QkFBQUEsUztJQUFXQyxTLHVCQUFBQSxTOzs7QUFFckMsSUFBSSxDQUFDSCxHQUFMLEVBQVU7QUFDTix3QkFBVUksSUFBVjtBQUNIOztBQUVELDBCQUFnQkMsTUFBaEIsQ0FBdUJMLEdBQXZCLEVBQTRCQyxXQUE1QixFQUNLSyxJQURMLENBQ1UsVUFBQ0MsR0FBRCxFQUFTO0FBQ1gsV0FBTyxtQkFBU0MsVUFBVCxDQUFvQkQsR0FBcEIsRUFBeUJMLFNBQXpCLENBQVA7QUFDSCxDQUhMLEVBSUtJLElBSkwsQ0FJVSxVQUFDRyxNQUFELEVBQVk7QUFDZCxrQkFBSUMsT0FBSixDQUFZLHFCQUFaO0FBQ0Esa0JBQUlBLE9BQUoseUJBQWtDLGdCQUFNQyxJQUFOLENBQVdGLE1BQVgsQ0FBbEMsSUFBdUROLFlBQVksaUNBQVosR0FBZ0QsRUFBdkc7QUFDQSxRQUFJQSxTQUFKLEVBQWU7QUFDWCwyQkFBSU0sTUFBSjtBQUNIO0FBQ0QsV0FBT0csUUFBUUMsT0FBUixFQUFQO0FBQ0gsQ0FYTCxFQVlLQyxLQVpMLENBWVc7QUFBQSxXQUFTLGNBQUlDLEtBQUosQ0FBVUEsTUFBTUMsT0FBaEIsQ0FBVDtBQUFBLENBWlgiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcclxuaW1wb3J0IGNvbW1hbmRlciBmcm9tICdjb21tYW5kZXInO1xyXG5pbXBvcnQgb3BuIGZyb20gJ29wbic7XHJcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsaydcclxuaW1wb3J0IEFyY2hpdmVEb2N1bWVudCBmcm9tIFwiLi9BcmNoaXZlRG9jdW1lbnRcIjtcclxuaW1wb3J0IFN0aXRjaGVyIGZyb20gXCIuL1N0aXRjaGVyXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4vTG9nXCI7XHJcblxyXG5jb21tYW5kZXJcclxuICAgIC52ZXJzaW9uKCcxLjAnKVxyXG4gICAgLm9wdGlvbignLXUsIC0tdXJsIFt1cmxdJywgJ3RoZSB1cmwgb2YgdGhlIHJlc291cmNlIChyZXF1aXJlZCknKVxyXG4gICAgLm9wdGlvbignLXMsIC0tc2NhbGUtZmFjdG9yIFtzY2FsZV0nLCAndGhlIHNpemUgb2YgdGhlIG91dHB1dCBpbWFnZSAob3B0aW9uczogMSwyLDQsOCwxNiwzMikgW2RlZmF1bHQ6IDFdJywgMzIpXHJcbiAgICAub3B0aW9uKCctdCwgLS1zYXZlLXRpbGVzIFtzYXZdJywgJ3NhdmUgdGhlIHNlcGFyYXRlIHRpbGVzIChkZWZhdWx0OiBmYWxzZSknLCBmYWxzZSlcclxuICAgIC5vcHRpb24oJy1vLCAtLW9wZW4taW1hZ2UgW29wZW5dJywgJ29wZW4gdGhlIGltYWdlIGFmdGVyIHNhdmluZyAoZGVmYXVsdDogdHJ1ZSknLCB0cnVlKVxyXG4gICAgLnBhcnNlKHByb2Nlc3MuYXJndik7XHJcblxyXG5jb25zdCB7IHVybCwgc2NhbGVGYWN0b3IsIHNhdmVUaWxlcywgb3BlbkltYWdlIH0gPSBjb21tYW5kZXI7XHJcblxyXG5pZiAoIXVybCkge1xyXG4gICAgY29tbWFuZGVyLmhlbHAoKTtcclxufVxyXG5cclxuQXJjaGl2ZURvY3VtZW50LmNyZWF0ZSh1cmwsIHNjYWxlRmFjdG9yKVxyXG4gICAgLnRoZW4oKGRvYykgPT4ge1xyXG4gICAgICAgIHJldHVybiBTdGl0Y2hlci5idWlsZEltYWdlKGRvYywgc2F2ZVRpbGVzKTtcclxuICAgIH0pXHJcbiAgICAudGhlbigob3V0cHV0KSA9PiB7XHJcbiAgICAgICAgTG9nLnN1Y2Nlc3MoJ1N0aXRjaGluZyBjb21wbGV0ZSEnKTtcclxuICAgICAgICBMb2cuc3VjY2VzcyhgSW1hZ2Ugd2FzIHNhdmVkIGF0ICR7Y2hhbGsuYmx1ZShvdXRwdXQpfSR7b3BlbkltYWdlID8gJyBhbmQgd2lsbCBiZSBvcGVuZWQgYW55IG1vbWVudC4nIDogJyd9YCk7XHJcbiAgICAgICAgaWYgKG9wZW5JbWFnZSkge1xyXG4gICAgICAgICAgICBvcG4ob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnJvciA9PiBMb2cuZXJyb3IoZXJyb3IubWVzc2FnZSkpO1xyXG4iXX0=