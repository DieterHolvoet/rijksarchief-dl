#! /usr/bin/env node
import 'babel-polyfill';
import commander from 'commander';
import ArchiveDocument from "./ArchiveDocument";

function buildArrays(fifs, layer) {
    var urls = [];
    var size = [layer.width, layer.height];

    var factories = Array(size[0]).fill().map(function (v, i) {
        var count = 0;
        return function (cb) {
            var values = {...fifs, tile: 1};
            var url = urls[count + i * size[1]];
            if (++count > size[1]) return cb(null, null);
            cb(null, request(url).pipe(new JPEGDecoder()));
        }
    });
}

commander
    .version('1.0')
    .option('-u, --url [url]', 'The url of the resource')
    .parse(process.argv);

if (commander.url) {
    const doc = new ArchiveDocument(commander.url);
    doc.fetchMeta()
        .then(() => {
            console.log('Longest part: ' + doc.fif3);
            console.log('Shorter part: ' + doc.fif5);
            console.log('Shortest part: ' + doc.fif7);

            const selectedLayer = doc.layers[doc.layers.length - 1];
            console.log(JSON.stringify(selectedLayer));
        });
}
