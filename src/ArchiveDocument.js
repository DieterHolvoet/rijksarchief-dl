import fetch from 'node-fetch';
import libxmljs from 'libxmljs';
import JPEGDecoder from 'jpg-stream/decoder';
import JPEGEncoder from 'jpg-stream/encoder';
import Mosaic from 'mosaic-image-stream';
import mergeImages from 'merge-images';
import Canvas from 'canvas';
import * as fs from 'fs';
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

        for (let row = 0; row < 2/*layer.rows - 1*/; row++) {
            for (let col = 0; col < layer.cols; col++) {
                const url = this.tileUrl(pos);

                // Fetch image
                const response = await fetch(url);
                const buffer = await response.buffer();

                tiles.push({
                    x: row * this.tilewidth,
                    y: col * this.tileheight,
                    src: buffer
                });

                fs.writeFile(path.join(__dirname, `${row}-${col}-image.jpg`), buffer, "binary", function(err) { console.log(err)});

                pos++;
            }
        }

        // Build and save image
        base64.decode(
            await mergeImages(tiles, { Canvas }),
            path.join(__dirname, 'image.jpg'),
            (err, output) => {
                console.log('success');
                console.log(err, output);
            }
        );
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
                    .pipe(new JPEGDecoder());

                streams[row].push(stream);
                pos++;
            }
        }

        return streams;
    }

    stitchTiles(layer, streams) {
        Mosaic(streams, layer.rows * this.tileheight)
            /*.on('error', console.error)
            .on('finish', () => console.log('hallo'))
            .on('close', () => console.log('hallos'))*/
            .pipe(new JPEGEncoder())
            .pipe(fs.createWriteStream(path.join(__dirname, 'testje.jpg')));
        // console.log(`Written to ${path.join(__dirname, 'testje.jpg')}`);
    }

    mosaics(layer) {
        var request = require('request')
        const size = [layer.rows, layer.cols];
        var factories = Array(size[0]).fill().map((v, i) => {
            var count = 0
            return (cb) => {
                var url = this.tileUrl(layer.starttile + (count * size[0]) + i);
                // console.log(count+', '+i+', '+size[1]);
                console.log(url);
                if (++count > size[1]) return cb(null, null)
                cb(null, request(url).pipe(new JPEGDecoder()))
            }
        })

        Mosaic(factories, size[1] * 150)
            .on('error', console.error)
            .pipe(new JPEGEncoder())
            .pipe(fs.createWriteStream(path.join(__dirname, 'testjse.jpg')))
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
