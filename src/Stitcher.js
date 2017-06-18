import Canvas from 'canvas';
import mergeImages from 'merge-images';
import ProgressBar from 'ascii-progress';
import streamToPromise from 'stream-to-promise';
import * as fs from 'fs';
import * as path from 'path';
import * as intoStream from 'into-stream';
import Fetcher from "./Fetcher";
import Log from "./Log";

class Stitcher {
    static writeTile(row, col, buffer) {
        return new Promise((resolve, reject) => {
            const filename = path.join(__dirname, `./tiles/${row}-${col}.jpg`);
            fs.writeFile(filename, buffer, "binary", function (err) {
                if (err) reject(err);
                else resolve({ filename });
            });
        })
    }

    static createTileDirectory() {
        try { fs.mkdirSync(path.join(__dirname, './tiles')) } catch (err) {
            if (err.code !== 'EEXIST') throw err
        }
    }

    static async buildImage(doc, layer, saveTiles = false) {
        let pos = layer.starttile;
        const output = path.join(__dirname, `${doc.fif(7)}.jpg`);
        const totalTiles = layer.cols * (layer.rows - 1);
        const tiles = [];

        if (saveTiles) {
            Stitcher.createTileDirectory();
        }

        Log.step(`Downloading ${totalTiles} tiles...`);
        const progressBar = new ProgressBar({
            schema: '      :bar :current/:total',
            filled: '█',
            total : totalTiles,
            clear: true,
        });

        // Fetch tiles
        for (let row = 0; row < layer.rows - 1; row++) {
            for (let col = 0; col < layer.cols; col++) {
                const { buffer } = await Fetcher.getTile(doc, pos);

                if (saveTiles) {
                    await Stitcher.writeTile(row, col, buffer);
                }

                tiles.push({
                    x: col * doc.tileHeight,
                    y: row * doc.tileWidth,
                    src: buffer,
                });

                pos++;
                progressBar.tick();
            }
        }

        // Stitch together tiles
        Log.step('Stitching together the final image...');
        const base = await mergeImages(tiles, {
            Canvas,
            format: doc.mimeType,
            width: layer.width,
            height: layer.height,
        });

        // Save result
        const bitmap = Buffer.from(base.split(`data:${doc.mimeType};base64`)[1], 'base64');
        const rs = intoStream.default(bitmap);
        const ws = fs.createWriteStream(output);
        rs.pipe(ws);
        await streamToPromise(ws);

        return output;
    }
}

export default Stitcher;
