import libxmljs from 'libxmljs';
import fetch from 'node-fetch';

class Fetcher {

    /**
     * Fetch information about an ArchiveDocument
     * @param doc
     * @return {Promise.<{tileWidth: Number, tileHeight: Number, mimeType, layers: (*|Array)}>}
     */
    static async getMeta(doc) {
        const url = Fetcher.getMetaUrl(doc);
        const response = await fetch(url);
        const body = await response.text();
        const xmlDoc = libxmljs.parseXml(body);
        if (false) {
            throw new Error(`Document with ID ${this.fif(7)} does not exist!`)
        }
        return {
            tileWidth: parseInt(xmlDoc.get('//tjpinfo/tilewidth').text()),
            tileHeight: parseInt(xmlDoc.get('//tjpinfo/tileheight').text()),
            mimeType: xmlDoc.get('//tjpinfo/mimetype').text(),
            layers: xmlDoc.get('//layers').find('layer')
                .map((layer) => {
                    const obj = {};
                    ['no', 'starttile', 'cols', 'rows', 'scalefactor', 'width', 'height'].forEach((attr) => {
                        obj[attr] = parseInt(layer.attr(attr).value());
                    });
                    return obj;
                })
        };
    }

    /**
     * Build a meta url based on an ArchiveDocument
     * @return {string}
     */
    static getMetaUrl(doc) {
        const fif = `${doc.fif(1)}/${doc.fif(3)}/${doc.fif(5)}/${doc.fif(7)}`;
        return `http://search.arch.be/imageserver/topview.xml.php?FIF=${fif}.jp2`;
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
        const buffer = await response.buffer();

        return { buffer };
    }

    /**
     * Build a tile url based on an ArchiveDocument
     * @param doc
     * @param tile
     * @return {string}
     */
    static getTileUrl(doc, tile) {
        const fif = `${doc.fif(1)}/${doc.fif(3)}/${doc.fif(5)}/${doc.fif(7)}`;
        return `http://search.arch.be/imageserver/getpic.php?${fif}.jp2&${tile}`;
    }
}

export default Fetcher;
