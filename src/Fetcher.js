import libxmljs from 'libxmljs';
import fetch from 'node-fetch';
import Log from "./Log";

class Fetcher {

    /**
     * Fetch information about an ArchiveDocument
     * @param doc
     * @param scaleFactor
     * @return {Promise.<{tileWidth: Number, tileHeight: Number, mimeType, layers: (*|Array)}>}
     */
    static async getMeta(doc, scaleFactor) {
        const url = Fetcher.getMetaUrl(doc);
        const response = await fetch(url);
        const body = await response.text();
        let xmlDoc = null;

        try {
            xmlDoc = libxmljs.parseXml(body);
        } catch(e) {
            throw new Error(`Document with id ${doc.fif(7)} does not exist!`);
        }

        const data = {
            tileWidth: parseInt(xmlDoc.get('//tjpinfo/tilewidth').text()),
            tileHeight: parseInt(xmlDoc.get('//tjpinfo/tileheight').text()),
            mimeType: xmlDoc.get('//tjpinfo/mimetype').text()
        };

        const layer = xmlDoc.get(`//layer[@scalefactor='${scaleFactor}']`);

        if (!layer) {
            throw new Error(`Scale factor ${scaleFactor} does not exist for this image.`);
        }

        ['no', 'starttile', 'cols', 'rows', 'scalefactor', 'width', 'height'].forEach((attr) => {
            data[attr] = parseInt(layer.attr(attr).value());
        });

        return data;
    }

    /**
     * Build a meta url based on an ArchiveDocument
     * @param doc
     * @return {string}
     * @example http://search.arch.be/imageserver/topview.xml.php?FIF=510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2
     */
    static getMetaUrl(doc) {
        const fif = `${doc.fif(1)}/${doc.fif(3)}/${doc.fif(5)}/${doc.fif(7)}`;
        return `http://search.arch.be/imageserver/topview.xml.php?FIF=${fif}.${doc.extension}`;
    }

    /**
     * Fetch a tile
     * @param doc
     * @param tile
     * @return {Promise.<{buffer: *}>}
     */
    static async getTile(doc, tile) {
        const url = Fetcher.getTileUrl(doc, tile);
        const response = await fetch(url);
        const text = await (response.clone()).text();

        if (text.includes('Fatal error: Uncaught exception')) {
            throw new Error(`Error while downloading tile ${tile}: This tile does not exist.`);
        }

        if (text.includes('Wrong TILE number')) {
            throw new Error(`Error while downloading tile ${tile}: Invalid tile number.`);
        }

        return { buffer: await response.buffer() };
    }

    /**
     * Build a tile url based on an ArchiveDocument
     * @param doc
     * @param tile
     * @return {string}
     * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&55
     */
    static getTileUrl(doc, tile) {
        const fif = `${doc.fif(1)}/${doc.fif(3)}/${doc.fif(5)}/${doc.fif(7)}`;
        return `http://search.arch.be/imageserver/getpic.php?${fif}.${doc.extension}&${tile}`;
    }
}

export default Fetcher;
