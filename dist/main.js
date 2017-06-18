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

_commander2.default.version('1.0').option('-u, --url [url]', 'the url of the resource (required)').option('-t, --save-tiles [sav]', 'save the separate tiles (default: false)', false).option('-o, --open-image [open]', 'open the image after saving (default: true)', true).parse(process.argv);

var url = _commander2.default.url,
    saveTiles = _commander2.default.saveTiles,
    openImage = _commander2.default.openImage;


if (!url) {
    _commander2.default.help();
}

_ArchiveDocument2.default.withUrl(url).then(function (doc) {
    var layer = doc.layers[doc.layers.length - 1];
    return _Stitcher2.default.buildImage(doc, layer, saveTiles);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInZlcnNpb24iLCJvcHRpb24iLCJwYXJzZSIsInByb2Nlc3MiLCJhcmd2IiwidXJsIiwic2F2ZVRpbGVzIiwib3BlbkltYWdlIiwiaGVscCIsIndpdGhVcmwiLCJ0aGVuIiwiZG9jIiwibGF5ZXIiLCJsYXllcnMiLCJsZW5ndGgiLCJidWlsZEltYWdlIiwib3V0cHV0Iiwic3VjY2VzcyIsImJsdWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImNhdGNoIiwiZXJyb3IiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsb0JBQ0tBLE9BREwsQ0FDYSxLQURiLEVBRUtDLE1BRkwsQ0FFWSxpQkFGWixFQUUrQixvQ0FGL0IsRUFHS0EsTUFITCxDQUdZLHdCQUhaLEVBR3NDLDBDQUh0QyxFQUdrRixLQUhsRixFQUlLQSxNQUpMLENBSVkseUJBSlosRUFJdUMsNkNBSnZDLEVBSXNGLElBSnRGLEVBS0tDLEtBTEwsQ0FLV0MsUUFBUUMsSUFMbkI7O0lBT1FDLEcsdUJBQUFBLEc7SUFBS0MsUyx1QkFBQUEsUztJQUFXQyxTLHVCQUFBQSxTOzs7QUFFeEIsSUFBSSxDQUFDRixHQUFMLEVBQVU7QUFDTix3QkFBVUcsSUFBVjtBQUNIOztBQUVELDBCQUFnQkMsT0FBaEIsQ0FBd0JKLEdBQXhCLEVBQ0tLLElBREwsQ0FDVSxVQUFDQyxHQUFELEVBQVM7QUFDWCxRQUFNQyxRQUFRRCxJQUFJRSxNQUFKLENBQVdGLElBQUlFLE1BQUosQ0FBV0MsTUFBWCxHQUFvQixDQUEvQixDQUFkO0FBQ0EsV0FBTyxtQkFBU0MsVUFBVCxDQUFvQkosR0FBcEIsRUFBeUJDLEtBQXpCLEVBQWdDTixTQUFoQyxDQUFQO0FBQ0gsQ0FKTCxFQUtLSSxJQUxMLENBS1UsVUFBQ00sTUFBRCxFQUFZO0FBQ2Qsa0JBQUlDLE9BQUosQ0FBWSxxQkFBWjtBQUNBLGtCQUFJQSxPQUFKLHlCQUFrQyxnQkFBTUMsSUFBTixDQUFXRixNQUFYLENBQWxDLElBQXVEVCxZQUFZLGlDQUFaLEdBQWdELEVBQXZHO0FBQ0EsUUFBSUEsU0FBSixFQUFlO0FBQ1gsMkJBQUlTLE1BQUo7QUFDSDtBQUNELFdBQU9HLFFBQVFDLE9BQVIsRUFBUDtBQUNILENBWkwsRUFhS0MsS0FiTCxDQWFXO0FBQUEsV0FBUyxjQUFJQyxLQUFKLENBQVVBLE1BQU1DLE9BQWhCLENBQVQ7QUFBQSxDQWJYIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XHJcbmltcG9ydCBjb21tYW5kZXIgZnJvbSAnY29tbWFuZGVyJztcclxuaW1wb3J0IG9wbiBmcm9tICdvcG4nO1xyXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnXHJcbmltcG9ydCBBcmNoaXZlRG9jdW1lbnQgZnJvbSBcIi4vQXJjaGl2ZURvY3VtZW50XCI7XHJcbmltcG9ydCBTdGl0Y2hlciBmcm9tIFwiLi9TdGl0Y2hlclwiO1xyXG5pbXBvcnQgTG9nIGZyb20gXCIuL0xvZ1wiO1xyXG5cclxuY29tbWFuZGVyXHJcbiAgICAudmVyc2lvbignMS4wJylcclxuICAgIC5vcHRpb24oJy11LCAtLXVybCBbdXJsXScsICd0aGUgdXJsIG9mIHRoZSByZXNvdXJjZSAocmVxdWlyZWQpJylcclxuICAgIC5vcHRpb24oJy10LCAtLXNhdmUtdGlsZXMgW3Nhdl0nLCAnc2F2ZSB0aGUgc2VwYXJhdGUgdGlsZXMgKGRlZmF1bHQ6IGZhbHNlKScsIGZhbHNlKVxyXG4gICAgLm9wdGlvbignLW8sIC0tb3Blbi1pbWFnZSBbb3Blbl0nLCAnb3BlbiB0aGUgaW1hZ2UgYWZ0ZXIgc2F2aW5nIChkZWZhdWx0OiB0cnVlKScsIHRydWUpXHJcbiAgICAucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuXHJcbmNvbnN0IHsgdXJsLCBzYXZlVGlsZXMsIG9wZW5JbWFnZSB9ID0gY29tbWFuZGVyO1xyXG5cclxuaWYgKCF1cmwpIHtcclxuICAgIGNvbW1hbmRlci5oZWxwKCk7XHJcbn1cclxuXHJcbkFyY2hpdmVEb2N1bWVudC53aXRoVXJsKHVybClcclxuICAgIC50aGVuKChkb2MpID0+IHtcclxuICAgICAgICBjb25zdCBsYXllciA9IGRvYy5sYXllcnNbZG9jLmxheWVycy5sZW5ndGggLSAxXTtcclxuICAgICAgICByZXR1cm4gU3RpdGNoZXIuYnVpbGRJbWFnZShkb2MsIGxheWVyLCBzYXZlVGlsZXMpO1xyXG4gICAgfSlcclxuICAgIC50aGVuKChvdXRwdXQpID0+IHtcclxuICAgICAgICBMb2cuc3VjY2VzcygnU3RpdGNoaW5nIGNvbXBsZXRlIScpO1xyXG4gICAgICAgIExvZy5zdWNjZXNzKGBJbWFnZSB3YXMgc2F2ZWQgYXQgJHtjaGFsay5ibHVlKG91dHB1dCl9JHtvcGVuSW1hZ2UgPyAnIGFuZCB3aWxsIGJlIG9wZW5lZCBhbnkgbW9tZW50LicgOiAnJ31gKTtcclxuICAgICAgICBpZiAob3BlbkltYWdlKSB7XHJcbiAgICAgICAgICAgIG9wbihvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVycm9yID0+IExvZy5lcnJvcihlcnJvci5tZXNzYWdlKSk7XHJcbiJdfQ==