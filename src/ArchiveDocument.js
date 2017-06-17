import fetch from 'node-fetch';
import libxmljs from 'libxmljs';
import mergeImages from 'merge-images';
import Canvas from 'canvas';
import opn from 'opn';
// import rimraf from "rimraf";
// import * as fs from 'fs';
import * as path from 'path';
import * as base64 from 'file-base64';

class ArchiveDocument {
    constructor(url) {
        const result = ArchiveDocument.extractFifs(url);
        this.fif7 = result[1];
        this.fif5 = result[2];
        this.fif3 = result[3];
        this.fif1 = result[4];
    }

    /**
     * Extract the required parts from the URL
     * @param val
     * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
     */
    static extractFifs(val) {
        return /(((([0-9]{3})_[0-9]{4}_[0-9]{3})_[0-9]{5}_[0-9]{3})_[0-9]{1}_[0-9]{4})/.exec(val);
    }

    /**
     * Build a meta url based on an object with the separate values
     * @return {string}
     */
    get metaUrl() {
        return `http://search.arch.be/imageserver/topview.xml.php?FIF=${this.fif1}/${this.fif3}/${this.fif5}/${this.fif7}.jp2`;
    }

    /**
     * Build a tile url based on an object with the separate values
     * @param tile
     * @return {string}
     */
    tileUrl(tile) {
        return `http://search.arch.be/imageserver/getpic.php?${this.fif1}/${this.fif3}/${this.fif5}/${this.fif7}.jp2&${tile}`;
    }

    async buildImage(layer) {
        let pos = layer.starttile;
        const tiles = [];

        /*
        const mkdirSync = function (dirPath) {
            try {
                fs.mkdirSync(dirPath)
            } catch (err) {
                if (err.code !== 'EEXIST') throw err
            }
        };

        const write = (row, col, buffer) => new Promise((resolve, reject) => {
            const filename = path.join(__dirname, `./tiles/${row}-${col}.jpg`);
            fs.writeFile(filename, buffer, "binary", function (err) {
                if (err) reject(err);
                else resolve({ filename });
            });
        });

        mkdirSync(path.join(__dirname, './tiles'));
        */

        console.log(`Downloading ${layer.cols * layer.rows} tiles...`);

        for (let row = 0; row < layer.rows - 1; row++) {
            for (let col = 0; col < layer.cols; col++) {
                const url = this.tileUrl(pos);

                // Fetch image
                const response = await fetch(url);
                const buffer = await response.buffer();

                // Draw image
                //const { filename } = await write(row, col, buffer);

                tiles.push({
                    x: col * this.tileheight,
                    y: row * this.tilewidth,
                    src: buffer,
                    // src: filename,
                });

                pos++;
            }
        }

        // Build and save image
        console.log('Stitching together the final image...');
        const base = await mergeImages(tiles, {
            Canvas,
            format: this.mimetype,
            width: layer.width,
            height: layer.height,
        });

        base64.decode(
            base.split(`data:${this.mimetype};base64`)[1],
            path.join(__dirname, `${this.fif7}.jpg`),
            (err, output) => {
                if (err) throw err;
            }
        );

        // Remove tiles
        // rimraf(`${path.join(__dirname, 'tiles')}/**`);

        // Open final image
        opn(path.join(__dirname, `${this.fif7}.jpg`));
    }

    async fetchMeta() {
        const result = await fetch(this.metaUrl);
        const body = await result.text();
        const xmlDoc = libxmljs.parseXml(body);

        // Extract tile dimensions
        this.tilewidth = parseInt(xmlDoc.get('//tjpinfo/tilewidth').text());
        this.tileheight = parseInt(xmlDoc.get('//tjpinfo/tileheight').text());

        // Extract mimetype
        this.mimetype = xmlDoc.get('//tjpinfo/mimetype').text();

        // Extract layers
        this.layers = xmlDoc.get('//layers').find('layer')
            .map((layer) => {
                const obj = {};
                ['no', 'starttile', 'cols', 'rows', 'scalefactor', 'width', 'height'].forEach((attr) => {
                    obj[attr] = parseInt(layer.attr(attr).value());
                });
                return obj;
            });
    }
}

export default ArchiveDocument;
