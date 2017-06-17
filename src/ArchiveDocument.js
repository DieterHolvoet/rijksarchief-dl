import fetch from 'node-fetch';
import libxmljs from 'libxmljs';
import JPEGDecoder from 'jpg-stream/decoder';
import JPEGEncoder from 'jpg-stream/encoder';
import Mosaic from 'mosaic-image-stream';
import * as fs from 'fs';
import * as path from 'path';

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

    async buildTileArrays(layer) {
        const streams = [];
        let pos = layer.starttile;

        for (let row = 0; row < 2/*layer.rows - 1*/; row++) {
            streams[row] = [];

            for (let col = 0; col < layer.cols; col++) {
                const url = this.tileUrl(pos);
                const res = await fetch(url);
                const stream = res.body
                    .on('error', err => console.error)
                    .pipe(new JPEGDecoder())
                    .on('meta', meta => console.log('Meta: '+JSON.stringify(meta)))
                    .on('finish', meta => console.log('Finish: '+JSON.stringify(meta)));

                streams[row].push(stream);
                pos++;
            }
        }

        return streams;
    }

    stitchTiles(layer, streams) {
        Mosaic(streams, layer.rows * this.tileheight)
            .on('error', console.error)
            .on('finish', () => console.log('hallo'))
            .pipe(new JPEGEncoder())
            .pipe(fs.createWriteStream(path.join(__dirname, 'testje.jpg')));
        console.log(`Written to ${path.join(__dirname, 'testje.jpg')}`);
    }

    async fetchMeta() {
        const result = await fetch(this.metaUrl);
        const body = await result.text();
        const xmlDoc = libxmljs.parseXml(body);

        // Extract tile dimensions
        this.tilewidth = parseInt(xmlDoc.get('//tjpinfo/tilewidth').text());
        this.tileheight = parseInt(xmlDoc.get('//tjpinfo/tileheight').text());

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
