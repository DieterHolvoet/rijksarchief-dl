#! /usr/bin/env node
import 'babel-polyfill';
import commander from 'commander';
import ArchiveDocument from "./ArchiveDocument";

commander
    .version('1.0')
    .option('-u, --url [url]', 'The url of the resource')
    .parse(process.argv);

if (commander.url) {
    const doc = new ArchiveDocument(commander.url);
    doc.fetchMeta()
        .then(() => {
            const selectedLayer = doc.layers[doc.layers.length - 1];
            // console.log(JSON.stringify(selectedLayer));
            return doc.buildImage(selectedLayer);
        })
        .then(() => {
            console.log('Stitching completed!');
        });
}
