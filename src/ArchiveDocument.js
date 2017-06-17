import fetch from 'node-fetch';
import libxmljs from 'libxmljs';

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

    async fetchMeta() {
        const result = await fetch(this.metaUrl);
        const body = await result.text();
        const xmlDoc = libxmljs.parseXml(body);

        // Extract layers
        this.layers = xmlDoc.get('//layers').find('layer')
            .map((layer) => ({
                no: layer.attr('no').value(),
                start: layer.attr('starttile').value(),
                cols: layer.attr('cols').value(),
                rows: layer.attr('rows').value(),
                scale: layer.attr('scalefactor').value(),
                width: layer.attr('width').value(),
                height: layer.attr('height').value(),
            }));
    }
}

export default ArchiveDocument;
