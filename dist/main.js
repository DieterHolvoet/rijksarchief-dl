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

_commander2.default.version('1.0').option('-u, --url [url]', 'the url of the resource (required)').option('-s, --scale-factor [scale]', 'the size of the output image (options: 1,2,4,8,16,32) [default: 1]', 32).option('-d, --out-dir [open]', 'the folder in which the image will be saved (default: working directory)', process.cwd()).option('-t, --save-tiles [sav]', 'save the separate tiles (default: false)', false).option('-o, --open-image [open]', 'open the image after saving (default: true)', true).parse(process.argv);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInZlcnNpb24iLCJvcHRpb24iLCJwcm9jZXNzIiwiY3dkIiwicGFyc2UiLCJhcmd2IiwidXJsIiwic2NhbGVGYWN0b3IiLCJzYXZlVGlsZXMiLCJvcGVuSW1hZ2UiLCJvdXREaXIiLCJoZWxwIiwiY3JlYXRlIiwidGhlbiIsImRvYyIsImJ1aWxkSW1hZ2UiLCJvdXRwdXQiLCJzdWNjZXNzIiwiYmx1ZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiY2F0Y2giLCJlcnJvciIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxvQkFDS0EsT0FETCxDQUNhLEtBRGIsRUFFS0MsTUFGTCxDQUVZLGlCQUZaLEVBRStCLG9DQUYvQixFQUdLQSxNQUhMLENBR1ksNEJBSFosRUFHMEMsb0VBSDFDLEVBR2dILEVBSGhILEVBSUtBLE1BSkwsQ0FJWSxzQkFKWixFQUlvQywwRUFKcEMsRUFJZ0hDLFFBQVFDLEdBQVIsRUFKaEgsRUFLS0YsTUFMTCxDQUtZLHdCQUxaLEVBS3NDLDBDQUx0QyxFQUtrRixLQUxsRixFQU1LQSxNQU5MLENBTVkseUJBTlosRUFNdUMsNkNBTnZDLEVBTXNGLElBTnRGLEVBT0tHLEtBUEwsQ0FPV0YsUUFBUUcsSUFQbkI7O0lBU1FDLEcsdUJBQUFBLEc7SUFBS0MsVyx1QkFBQUEsVztJQUFhQyxTLHVCQUFBQSxTO0lBQVdDLFMsdUJBQUFBLFM7SUFBV0MsTSx1QkFBQUEsTTs7O0FBRWhELElBQUksQ0FBQ0osR0FBTCxFQUFVO0FBQ04sd0JBQVVLLElBQVY7QUFDSDs7QUFFRCwwQkFBZ0JDLE1BQWhCLENBQXVCTixHQUF2QixFQUE0QkMsV0FBNUIsRUFDS00sSUFETCxDQUNVLFVBQUNDLEdBQUQsRUFBUztBQUNYLFdBQU8sbUJBQVNDLFVBQVQsQ0FBb0JELEdBQXBCLEVBQXlCSixNQUF6QixFQUFpQ0YsU0FBakMsQ0FBUDtBQUNILENBSEwsRUFJS0ssSUFKTCxDQUlVLFVBQUNHLE1BQUQsRUFBWTtBQUNkLGtCQUFJQyxPQUFKLENBQVkscUJBQVo7QUFDQSxrQkFBSUEsT0FBSix5QkFBa0MsZ0JBQU1DLElBQU4sQ0FBV0YsTUFBWCxDQUFsQyxJQUF1RFAsWUFBWSxpQ0FBWixHQUFnRCxFQUF2RztBQUNBLFFBQUlBLFNBQUosRUFBZTtBQUNYLDJCQUFJTyxNQUFKO0FBQ0g7QUFDRCxXQUFPRyxRQUFRQyxPQUFSLEVBQVA7QUFDSCxDQVhMLEVBWUtDLEtBWkwsQ0FZVztBQUFBLFdBQVMsY0FBSUMsS0FBSixDQUFVQSxNQUFNQyxPQUFoQixDQUFUO0FBQUEsQ0FaWCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xyXG5pbXBvcnQgY29tbWFuZGVyIGZyb20gJ2NvbW1hbmRlcic7XHJcbmltcG9ydCBvcG4gZnJvbSAnb3BuJztcclxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJ1xyXG5pbXBvcnQgQXJjaGl2ZURvY3VtZW50IGZyb20gXCIuL0FyY2hpdmVEb2N1bWVudFwiO1xyXG5pbXBvcnQgU3RpdGNoZXIgZnJvbSBcIi4vU3RpdGNoZXJcIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi9Mb2dcIjtcclxuXHJcbmNvbW1hbmRlclxyXG4gICAgLnZlcnNpb24oJzEuMCcpXHJcbiAgICAub3B0aW9uKCctdSwgLS11cmwgW3VybF0nLCAndGhlIHVybCBvZiB0aGUgcmVzb3VyY2UgKHJlcXVpcmVkKScpXHJcbiAgICAub3B0aW9uKCctcywgLS1zY2FsZS1mYWN0b3IgW3NjYWxlXScsICd0aGUgc2l6ZSBvZiB0aGUgb3V0cHV0IGltYWdlIChvcHRpb25zOiAxLDIsNCw4LDE2LDMyKSBbZGVmYXVsdDogMV0nLCAzMilcclxuICAgIC5vcHRpb24oJy1kLCAtLW91dC1kaXIgW29wZW5dJywgJ3RoZSBmb2xkZXIgaW4gd2hpY2ggdGhlIGltYWdlIHdpbGwgYmUgc2F2ZWQgKGRlZmF1bHQ6IHdvcmtpbmcgZGlyZWN0b3J5KScsIHByb2Nlc3MuY3dkKCkpXHJcbiAgICAub3B0aW9uKCctdCwgLS1zYXZlLXRpbGVzIFtzYXZdJywgJ3NhdmUgdGhlIHNlcGFyYXRlIHRpbGVzIChkZWZhdWx0OiBmYWxzZSknLCBmYWxzZSlcclxuICAgIC5vcHRpb24oJy1vLCAtLW9wZW4taW1hZ2UgW29wZW5dJywgJ29wZW4gdGhlIGltYWdlIGFmdGVyIHNhdmluZyAoZGVmYXVsdDogdHJ1ZSknLCB0cnVlKVxyXG4gICAgLnBhcnNlKHByb2Nlc3MuYXJndik7XHJcblxyXG5jb25zdCB7IHVybCwgc2NhbGVGYWN0b3IsIHNhdmVUaWxlcywgb3BlbkltYWdlLCBvdXREaXIgfSA9IGNvbW1hbmRlcjtcclxuXHJcbmlmICghdXJsKSB7XHJcbiAgICBjb21tYW5kZXIuaGVscCgpO1xyXG59XHJcblxyXG5BcmNoaXZlRG9jdW1lbnQuY3JlYXRlKHVybCwgc2NhbGVGYWN0b3IpXHJcbiAgICAudGhlbigoZG9jKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIFN0aXRjaGVyLmJ1aWxkSW1hZ2UoZG9jLCBvdXREaXIsIHNhdmVUaWxlcyk7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKG91dHB1dCkgPT4ge1xyXG4gICAgICAgIExvZy5zdWNjZXNzKCdTdGl0Y2hpbmcgY29tcGxldGUhJyk7XHJcbiAgICAgICAgTG9nLnN1Y2Nlc3MoYEltYWdlIHdhcyBzYXZlZCBhdCAke2NoYWxrLmJsdWUob3V0cHV0KX0ke29wZW5JbWFnZSA/ICcgYW5kIHdpbGwgYmUgb3BlbmVkIGFueSBtb21lbnQuJyA6ICcnfWApO1xyXG4gICAgICAgIGlmIChvcGVuSW1hZ2UpIHtcclxuICAgICAgICAgICAgb3BuKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4gTG9nLmVycm9yKGVycm9yLm1lc3NhZ2UpKTtcclxuIl19