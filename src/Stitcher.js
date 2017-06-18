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

    static writeTile(row, col, buffer, output) {
        return Stitcher.writeFile(buffer, path.join(output, `./tiles/${row}-${col}.jpg`));
    }

    static createTileDirectory(output) {
        try { fs.mkdirSync(path.join(output, './tiles')) } catch (err) {
            if (err.code !== 'EEXIST') throw err
        }
    }

    static async buildImage(doc, outputFolder, saveTiles = false) {
        let pos = doc.starttile;
        const totalTiles = doc.cols * doc.rows;
        const tiles = [];
        const outputFile = path.join(outputFolder, `${doc.fif(7)}@${doc.scalefactor}.jpg`);

        // Single image
        if (doc.rows === 1 && doc.cols === 1) {
            Log.step(`Downloading image...`);
            const { buffer } = await Fetcher.getTile(doc, pos);

            Log.step('Saving image...');
            await Stitcher.writeFile(buffer, outputFile);

            return output;
        }

        if (saveTiles) {
            Stitcher.createTileDirectory(outputFolder);
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
                    await Stitcher.writeTile(row, col, buffer, outputFolder);
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
        const ws = fs.createWriteStream(outputFile);
        rs.pipe(ws);
        await streamToPromise(ws);

        return outputFile;
    }
}

export default Stitcher;
