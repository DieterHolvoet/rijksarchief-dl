import Fetcher from "./Fetcher";
import Log from "./Log";

class ArchiveDocument {
    static async create(url, scaleFactor) {
        const instance = new this;
        Log.step('Fetching info about image...');
        Object.assign(instance, ArchiveDocument.parseUrl(url));
        Object.assign(instance, await Fetcher.getMeta(instance, scaleFactor));
        return instance;
    }

    /**
     * Extract the required parts from the URL
     * @param val
     * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
     */
    static parseUrl(val) {
        const result = /([0-9]{3})_([0-9]{4})_([0-9]{3})_([0-9]{5})_([0-9]{3})_([0-9]{1})_([0-9]{4})\.?([a-zA-Z0-9]+)?/.exec(val);
        if (!result) {
            throw new Error('Error while parsing the url: no document ID found.')
        }

        const fifs = Array.from(result);
        fifs.shift();

        const extension = fifs.pop() || 'jp2';

        return { fifs, extension };
    }

    fif(num) {
        const fifs = [...this.fifs];
        fifs.length -= (fifs.length - num);
        return fifs.join('_');
    }
}

export default ArchiveDocument;
