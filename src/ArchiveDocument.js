import Fetcher from "./Fetcher";
import Log from "./Log";

class ArchiveDocument {
    static async create(url, scaleFactor) {
        Log.step('Fetching info about image...');
        const instance = new this;
        instance.fifs = ArchiveDocument.parseUrl(url);
        Object.assign(instance, await Fetcher.getMeta(instance, scaleFactor));
        return instance;
    }

    /**
     * Extract the required parts from the URL
     * @param val
     * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
     */
    static parseUrl(val) {
        const result = Array.from(/([0-9]{3})_([0-9]{4})_([0-9]{3})_([0-9]{5})_([0-9]{3})_([0-9]{1})_([0-9]{4})/.exec(val));
        result.shift();
        return result;
    }

    fif(num) {
        const fifs = [...this.fifs];
        fifs.length -= (fifs.length - num);
        return fifs.join('_');
    }
}

export default ArchiveDocument;
