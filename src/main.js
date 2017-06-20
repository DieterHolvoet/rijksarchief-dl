#! /usr/bin/env node
import 'babel-polyfill';
import commander from 'commander';
import opn from 'opn';
import chalk from 'chalk'
import ArchiveDocument from "./ArchiveDocument";
import Stitcher from "./Stitcher";
import Log from "./Log";

commander
    .version('1.0')
    .option('-u, --url [url]', 'the url of the image (required)')
    .option('-s, --scale-factor [scale]', 'the scale factor of the image: determines the resolution, the bigger the scale factor, the smaller the image (options: 1,2,4,8,16,32) [optional, default: 1]', 1)
    .option('-d, --out-dir [open]', 'the folder in which the image will be saved (optional, default: working directory)', process.cwd())
    .option('-t, --save-tiles [sav]', 'save the separate tiles (optional, default: false)', false)
    .option('-o, --open-image [open]', 'open the image when finished (optional, default: true)', true)
    .parse(process.argv);

const { url, scaleFactor, saveTiles, openImage, outDir } = commander;

if (!url) {
    commander.help();
}

ArchiveDocument.create(url, scaleFactor)
    .then((doc) => {
        return Stitcher.buildImage(doc, outDir, saveTiles);
    })
    .then((output) => {
        Log.success('Stitching complete!');
        Log.success(`Image was saved at ${chalk.blue(output)}${openImage ? ' and will be opened any moment.' : ''}`);
        if (openImage) {
            opn(output);
        }
        return Promise.resolve();
    })
    .catch(error => Log.error(error.message));
