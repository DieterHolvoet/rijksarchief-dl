import mergeImages from 'merge-images';
import Canvas from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import * as base64 from 'file-base64';
import Fetcher from "./Fetcher";

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
        const tiles = [];

        if (saveTiles) {
            Stitcher.createTileDirectory();
        }

        console.log(`Downloading ${layer.cols * layer.rows} tiles...`);

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
            }
        }

        // Stitch together tiles
        console.log('Stitching together the final image...');
        const base = await mergeImages(tiles, {
            Canvas,
            format: doc.mimeType,
            width: layer.width,
            height: layer.height,
        });

        // Save result
        base64.decode(
            base.split(`data:${doc.mimeType};base64`)[1],
            output,
            (err) => {
                if (err) throw err;
            }
        );

        return output;
    }
}

export default Stitcher;
