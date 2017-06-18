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

_commander2.default.version('1.0').option('-u, --url [url]', 'the url of the resource (required)').option('-s, --scale-factor [scale]', 'the size of the output image (options: 1,2,4,8,16,32) [default: 1]', 1).option('-d, --out-dir [open]', 'the folder in which the image will be saved (default: working directory)', process.cwd()).option('-t, --save-tiles [sav]', 'save the separate tiles (default: false)', false).option('-o, --open-image [open]', 'open the image after saving (default: true)', true).parse(process.argv);

var url = _commander2.default.url,
    scaleFactor = _commander2.default.scaleFactor,
    saveTiles = _commander2.default.saveTiles,
    openImage = _commander2.default.openImage,
    outDir = _commander2.default.outDir;


if (!url) {
    _commander2.default.help();
}

_ArchiveDocument2.default.create(url, scaleFactor).then(function (doc) {
    return _Stitcher2.default.buildImage(doc, outDir, saveTiles);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInZlcnNpb24iLCJvcHRpb24iLCJwcm9jZXNzIiwiY3dkIiwicGFyc2UiLCJhcmd2IiwidXJsIiwic2NhbGVGYWN0b3IiLCJzYXZlVGlsZXMiLCJvcGVuSW1hZ2UiLCJvdXREaXIiLCJoZWxwIiwiY3JlYXRlIiwidGhlbiIsImRvYyIsImJ1aWxkSW1hZ2UiLCJvdXRwdXQiLCJzdWNjZXNzIiwiYmx1ZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiY2F0Y2giLCJlcnJvciIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxvQkFDS0EsT0FETCxDQUNhLEtBRGIsRUFFS0MsTUFGTCxDQUVZLGlCQUZaLEVBRStCLG9DQUYvQixFQUdLQSxNQUhMLENBR1ksNEJBSFosRUFHMEMsb0VBSDFDLEVBR2dILENBSGhILEVBSUtBLE1BSkwsQ0FJWSxzQkFKWixFQUlvQywwRUFKcEMsRUFJZ0hDLFFBQVFDLEdBQVIsRUFKaEgsRUFLS0YsTUFMTCxDQUtZLHdCQUxaLEVBS3NDLDBDQUx0QyxFQUtrRixLQUxsRixFQU1LQSxNQU5MLENBTVkseUJBTlosRUFNdUMsNkNBTnZDLEVBTXNGLElBTnRGLEVBT0tHLEtBUEwsQ0FPV0YsUUFBUUcsSUFQbkI7O0lBU1FDLEcsdUJBQUFBLEc7SUFBS0MsVyx1QkFBQUEsVztJQUFhQyxTLHVCQUFBQSxTO0lBQVdDLFMsdUJBQUFBLFM7SUFBV0MsTSx1QkFBQUEsTTs7O0FBRWhELElBQUksQ0FBQ0osR0FBTCxFQUFVO0FBQ04sd0JBQVVLLElBQVY7QUFDSDs7QUFFRCwwQkFBZ0JDLE1BQWhCLENBQXVCTixHQUF2QixFQUE0QkMsV0FBNUIsRUFDS00sSUFETCxDQUNVLFVBQUNDLEdBQUQsRUFBUztBQUNYLFdBQU8sbUJBQVNDLFVBQVQsQ0FBb0JELEdBQXBCLEVBQXlCSixNQUF6QixFQUFpQ0YsU0FBakMsQ0FBUDtBQUNILENBSEwsRUFJS0ssSUFKTCxDQUlVLFVBQUNHLE1BQUQsRUFBWTtBQUNkLGtCQUFJQyxPQUFKLENBQVkscUJBQVo7QUFDQSxrQkFBSUEsT0FBSix5QkFBa0MsZ0JBQU1DLElBQU4sQ0FBV0YsTUFBWCxDQUFsQyxJQUF1RFAsWUFBWSxpQ0FBWixHQUFnRCxFQUF2RztBQUNBLFFBQUlBLFNBQUosRUFBZTtBQUNYLDJCQUFJTyxNQUFKO0FBQ0g7QUFDRCxXQUFPRyxRQUFRQyxPQUFSLEVBQVA7QUFDSCxDQVhMLEVBWUtDLEtBWkwsQ0FZVztBQUFBLFdBQVMsY0FBSUMsS0FBSixDQUFVQSxNQUFNQyxPQUFoQixDQUFUO0FBQUEsQ0FaWCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xyXG5pbXBvcnQgY29tbWFuZGVyIGZyb20gJ2NvbW1hbmRlcic7XHJcbmltcG9ydCBvcG4gZnJvbSAnb3BuJztcclxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJ1xyXG5pbXBvcnQgQXJjaGl2ZURvY3VtZW50IGZyb20gXCIuL0FyY2hpdmVEb2N1bWVudFwiO1xyXG5pbXBvcnQgU3RpdGNoZXIgZnJvbSBcIi4vU3RpdGNoZXJcIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi9Mb2dcIjtcclxuXHJcbmNvbW1hbmRlclxyXG4gICAgLnZlcnNpb24oJzEuMCcpXHJcbiAgICAub3B0aW9uKCctdSwgLS11cmwgW3VybF0nLCAndGhlIHVybCBvZiB0aGUgcmVzb3VyY2UgKHJlcXVpcmVkKScpXHJcbiAgICAub3B0aW9uKCctcywgLS1zY2FsZS1mYWN0b3IgW3NjYWxlXScsICd0aGUgc2l6ZSBvZiB0aGUgb3V0cHV0IGltYWdlIChvcHRpb25zOiAxLDIsNCw4LDE2LDMyKSBbZGVmYXVsdDogMV0nLCAxKVxyXG4gICAgLm9wdGlvbignLWQsIC0tb3V0LWRpciBbb3Blbl0nLCAndGhlIGZvbGRlciBpbiB3aGljaCB0aGUgaW1hZ2Ugd2lsbCBiZSBzYXZlZCAoZGVmYXVsdDogd29ya2luZyBkaXJlY3RvcnkpJywgcHJvY2Vzcy5jd2QoKSlcclxuICAgIC5vcHRpb24oJy10LCAtLXNhdmUtdGlsZXMgW3Nhdl0nLCAnc2F2ZSB0aGUgc2VwYXJhdGUgdGlsZXMgKGRlZmF1bHQ6IGZhbHNlKScsIGZhbHNlKVxyXG4gICAgLm9wdGlvbignLW8sIC0tb3Blbi1pbWFnZSBbb3Blbl0nLCAnb3BlbiB0aGUgaW1hZ2UgYWZ0ZXIgc2F2aW5nIChkZWZhdWx0OiB0cnVlKScsIHRydWUpXHJcbiAgICAucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuXHJcbmNvbnN0IHsgdXJsLCBzY2FsZUZhY3Rvciwgc2F2ZVRpbGVzLCBvcGVuSW1hZ2UsIG91dERpciB9ID0gY29tbWFuZGVyO1xyXG5cclxuaWYgKCF1cmwpIHtcclxuICAgIGNvbW1hbmRlci5oZWxwKCk7XHJcbn1cclxuXHJcbkFyY2hpdmVEb2N1bWVudC5jcmVhdGUodXJsLCBzY2FsZUZhY3RvcilcclxuICAgIC50aGVuKChkb2MpID0+IHtcclxuICAgICAgICByZXR1cm4gU3RpdGNoZXIuYnVpbGRJbWFnZShkb2MsIG91dERpciwgc2F2ZVRpbGVzKTtcclxuICAgIH0pXHJcbiAgICAudGhlbigob3V0cHV0KSA9PiB7XHJcbiAgICAgICAgTG9nLnN1Y2Nlc3MoJ1N0aXRjaGluZyBjb21wbGV0ZSEnKTtcclxuICAgICAgICBMb2cuc3VjY2VzcyhgSW1hZ2Ugd2FzIHNhdmVkIGF0ICR7Y2hhbGsuYmx1ZShvdXRwdXQpfSR7b3BlbkltYWdlID8gJyBhbmQgd2lsbCBiZSBvcGVuZWQgYW55IG1vbWVudC4nIDogJyd9YCk7XHJcbiAgICAgICAgaWYgKG9wZW5JbWFnZSkge1xyXG4gICAgICAgICAgICBvcG4ob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnJvciA9PiBMb2cuZXJyb3IoZXJyb3IubWVzc2FnZSkpO1xyXG4iXX0=