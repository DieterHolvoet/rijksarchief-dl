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
    static writeFile(buffer, path) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, buffer, "binary", function (err) {
                if (err) reject(err);
                else resolve({ path });
            });
        })
    }

    static writeTile(row, col, buffer) {
        return Stitcher.writeFile(buffer, path.join(__dirname, `./tiles/${row}-${col}.jpg`));
    }

    static createTileDirectory() {
        try { fs.mkdirSync(path.join(__dirname, './tiles')) } catch (err) {
            if (err.code !== 'EEXIST') throw err
        }
    }

    static async buildImage(doc, saveTiles = false) {
        let pos = doc.starttile;
        const output = path.join(__dirname, `${doc.fif(7)}@${doc.scalefactor}.jpg`);
        const totalTiles = doc.cols * doc.rows;
        const tiles = [];

        // Single image
        if (doc.rows === 1 && doc.cols === 1) {
            Log.step(`Downloading image...`);
            const { buffer } = await Fetcher.getTile(doc, pos);

            Log.step('Saving image...');
            await Stitcher.writeFile(buffer, output);

            return output;
        }

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
        let row = 0;
        do {
            for (let col = 0; col < doc.cols; col++) {
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
            row++
        } while (row < doc.rows);

        // Stitch together tiles
        Log.step('Stitching together the final image...');
        const base = await mergeImages(tiles, {
            Canvas,
            format: doc.mimeType,
            width: doc.width,
            height: doc.height,
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
