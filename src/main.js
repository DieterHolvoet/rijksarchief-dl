#! /usr/bin/env node
import 'babel-polyfill';
import commander from 'commander';
import opn from 'opn';
import ArchiveDocument from "./ArchiveDocument";
import Stitcher from "./Stitcher";

commander
    .version('1.0')
    .option('-u, --url [url]', 'The url of the resource')
    .parse(process.argv);

if (!commander.url) {
    commander.help();
}

ArchiveDocument.withUrl(commander.url)
    .then((doc) => {
        const layer = doc.layers[doc.layers.length - 1];
        return Stitcher.buildImage(doc, layer, false);
    })
    .then((output) => {
        console.log('Stitching complete!');

        // Open final image
        opn(output);
    })
    .error(error => console.error(error.message));
