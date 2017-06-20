## rijksarchief-dl

[![Dependency Status][david-badge]][david-badge-url]
[![devDependency Status][david-dev-badge]][david-dev-badge-url]
[![npm][npm-badge]][npm-badge-url]

A command line tool to download images from the Belgian National Archives

## Prerequisites

You'll need to have Node.js and npm installed. This was only tested with npm 5.0.3 and Node.js 8.0.0, but it should work on the latest version. 

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Arguments](#arguments)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)
```bash
$ yarn global add rijksarchief-dl
# or...
$ npm install -g rijksarchief-dl
```

## Usage

Go to [search.arch.be](http://search.arch.be) and make an account. You'll only be able to browse and view scans if you're logged in.

Use the search functionality to find archives relevant to your search. 
Make sure to check 'Alleen toegangen met scans' to only show archives with images publicly accessible from the website.

When you've found an archive, browse the available images and open the one you want. 
You should be able to view the image through some Adobe Flash applet. 
At this point, copy the url: it should contain a code in the form of `XXX_XXXX_XXX_XXXXX_XXX_X_XXXX`, this is used to identify and download the correct image. 

#### Example
```bash
rijksarchief-dl --url "http://search.arch.be/nl/zoeken-naar-archieven/zoekresultaat/inventaris/rabscan/dao/1/eadid/BE-A0546_005577_006261_FRE/inventarisnr/I626100000001/afbeelding/546_0091_000_00575_000_0_0002.tjp"
```


### Arguments
| Long           	| Short 	| Description                                                                                                                           	| Required                        	|
|----------------	|-------	|---------------------------------------------------------------------------------------------------------------------------------------	|---------------------------------	|
| --help         	| -h    	| Output usage information                                                                                                              	| no                              	|
| --version      	| -V    	| Output the version number                                                                                                             	| no                              	|
| --url [url]    	| -u    	| The url of the image                                                                                                                  	| yes                             	|
| --scale-factor 	| -s    	| The scale factor of the image: determines the resolution, the bigger the scale factor, the smaller the image (options: 1,2,4,8,16,32) 	| no (default: 1)                 	|
| --out-dir      	| -d    	| The folder in which the image will be saved                                                                                           	| no (default: working directory) 	|
| --save-tiles   	| -t    	| Save the seperate tiles                                                                                                               	| no (default: false)             	|
| --open-image   	| -o    	| Open the image when finished                                                                                                          	| no (default: true)              	|

[david-badge]: https://david-dm.org/dieterholvoet/rijksarchief-dl.svg
[david-badge-url]: https://david-dm.org/dieterholvoet/rijksarchief-dl
[david-dev-badge]: https://david-dm.org/dieterholvoet/rijksarchief-dl/dev-status.svg
[david-dev-badge-url]: https://david-dm.org/dieterholvoet/rijksarchief-dl?type=dev
[npm-badge]: https://img.shields.io/npm/v/rijksarchief-dl.svg
[npm-badge-url]: https://www.npmjs.com/package/rijksarchief-dl
