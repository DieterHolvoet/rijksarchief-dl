#! /usr/bin/env node
var program = require('commander');

/**
 * Extract the required parts from the URL
 * @param val
 * @return {{url: string, longest: *, shorter: *, shortest: *}}
 * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
 */
function parseUrl(val) {
    var result = /((([0-9]{3}_[0-9]{4}_[0-9]{3})_[0-9]{5}_[0-9]{3})_[0-9]{1}_[0-9]{4})/.exec(val);
    return {
        url: result.input,
        longest: result[1],
        shorter: result[2],
        shortest: result[3]
    };
}

program
    .version('1.0')
    .option('-u, --url [url]', 'The url of the resource')
    .parse(process.argv);

if (program.url) {
    console.log('Longest part: ' + parseUrl(program.url).longest);
    console.log('Shorter part: ' + parseUrl(program.url).shorter);
    console.log('Shortest part: ' + parseUrl(program.url).shortest);
}
