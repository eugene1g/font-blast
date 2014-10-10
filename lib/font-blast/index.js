"use strict";

var path      = require('path'),
    fs        = require('graceful-fs'),
    mkdir     = require('mkdirp'),
    verify    = require('./verify'),
    extractor = require('./glyph-extractor')
    ;

module.exports = function (fontFile, destinationFolder, userConfig) {

    var config = {};
    //merge-in configuration from the user
    if (typeof userConfig == 'object') {
        Object.keys(userConfig).forEach(function (userKey) {
            config[userKey] = userConfig[userKey];
        });
    }

    var svgFontContent = fs.readFileSync(fontFile, 'utf-8');

    extractor(svgFontContent, config.filenames, function (characterSvgs) {

        console.info("Found " + characterSvgs.length + " available icons in the font");
        console.info("Generating SVG content for each character...");


        var svgDir = path.resolve(process.cwd(), path.join(destinationFolder, 'svg')),
            pngDir = path.resolve(process.cwd(), path.join(destinationFolder, 'png'));

        if (!fs.existsSync(svgDir)) mkdir.sync(svgDir);

        var savedIcons = [];
        characterSvgs.forEach(function (char) {

            var filename = char.name ? char.name : char.code;
            //If a subset of icons set was requested, ignore any others that are not within the subset
            if (config.icons && config.icons.length &&
                config.icons.indexOf(char.code) == -1 &&
                config.icons.indexOf(filename) == -1) {
                return;
            }
            savedIcons.push(char);
            fs.writeFileSync(path.join(svgDir, filename + '.svg'), char.svg);
        });
        console.info("Saved " + savedIcons.length + " files to " + svgDir);

        if (config.png && !isNaN(config.png)) {
            console.info("Generating PNG images - this may take a minute...");
            var generator = require('./png-generator');
            generator(svgDir, pngDir, config.png);
        }

        verify(svgFontContent, savedIcons, config.png, destinationFolder);
    });
}