#! /usr/bin/env node
import 'babel-polyfill';
import commander from 'commander';
import opn from 'opn';
import ArchiveDocument from "./ArchiveDocument";
import Stitcher from "./Stitcher";

commander
    .version('1.0')
    .option('-u, --url [url]', 'the url of the resource (required)')
    .option('-t, --save-tiles [sav]', 'save the separate tiles (default: false)', false)
    .option('-o, --open-image [open]', 'open the image after saving (default: true)', true)
    .parse(process.argv);

const { url, saveTiles, openImage } = commander;

if (!url) {
    commander.help();
}

ArchiveDocument.withUrl(url)
    .then((doc) => {
        const layer = doc.layers[doc.layers.length - 1];
        return Stitcher.buildImage(doc, layer, saveTiles);
    })
    .then((output) => {
        console.log('Stitching complete!');
        if (openImage) {
            opn(output);
        }
        return Promise.resolve();
    })
    .catch(error => console.error(error.message));
