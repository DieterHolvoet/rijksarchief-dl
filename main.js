#! /usr/bin/env node
var program = require('commander');
var fetch = require('node-fetch');
var FormData = require('form-data');
var libxmljs = require("libxmljs");
var querystring = require('querystring');

/**
 * Extract the required parts from the URL
 * @param val
 * @return {{url: string, longest: *, shorter: *, shortest: *}}
 * @example http://search.arch.be/imageserver/getpic.php?510/510_1546_000/510_1546_000_01852_000/510_1546_000_01852_000_0_0001.jp2&249
 */
function parseUrl(val) {
    var result = /(((([0-9]{3})_[0-9]{4}_[0-9]{3})_[0-9]{5}_[0-9]{3})_[0-9]{1}_[0-9]{4})/.exec(val);
    var splittedURL = result.input.split('?');
    var params = splittedURL[1].split('&');

    return {
        base_url: splittedURL[0],
        tile: params[1]
        fif7: result[1],
        fif5: result[2],
        fif3: result[3],
        fif1: result[4]
    };
}

/**
 * Build a meta url based on an object with the seperate values
 * @param val
 * @return {string}
 */
function buildMetaUrl(val) {
    return `http://search.arch.be/imageserver/topview.xml.php?FIF=${val.fif1}/${val.fif3}/${val.fif5}/${val.fif7}.jp2`
}

/**
 * Build a tile url based on an object with the seperate values
 * @param val
 * @return {string}
 */
function buildTileUrl(val) {
    return `http://search.arch.be/imageserver/getpic.php?${val.fif1}/${val.fif3}/${val.fif5}/${val.fif7}.jp2&${val.tile}`
}

/**
 * Extract layers from XML response
 * @param response
 * @return Object[]
 */
function getLayers(response) {
    var xmlDoc = libxmljs.parseXml(response);
    var layers = xmlDoc.get('//layers').find('layer');
    return layers.map(function (layer) {
        return {
            no: layer.attr('no').value(),
            start: layer.attr('starttile').value(),
            cols: layer.attr('cols').value(),
            rows: layer.attr('rows').value(),
            scale: layer.attr('scalefactor').value(),
            width: layer.attr('width').value(),
            height: layer.attr('height').value(),
        }
    });
}

function buildArrays(fifs, layer) {
    var urls = [];
    var size = [layer.width, layer.height];

    var factories = Array(size[0]).fill().map(function (v, i) {
        var count = 0
        return function (cb) {
            var values = {...fifs, tile: };
            var url = urls[count + i * size[1]]
            if (++count > size[1]) return cb(null, null)
            cb(null, request(url).pipe(new JPEGDecoder()))
        }
    });
}

program
    .version('1.0')
    .option('-u, --url [url]', 'The url of the resource')
    .parse(process.argv);

if (program.url) {
    console.log('Longest part: ' + parseUrl(program.url).fif3);
    console.log('Shorter part: ' + parseUrl(program.url).fif5);
    console.log('Shortest part: ' + parseUrl(program.url).fif7);
}
var fifs = parseUrl(program.url);

// Fetch info
fetch(buildMetaUrl(fifs))
    .then(function (res) {
        return res.text();
    }).then(function (body) {
        var layers = getLayers(body);
        var selectedLayer = layers[layers.length - 1];
        console.log(fifs.url);
        console.log(JSON.stringify(selectedLayer));
    });
