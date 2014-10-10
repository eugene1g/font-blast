"use strict";

var svgo = new (require('svgo')), xmldom = require('xmldom').DOMParser;

/**
 * Callback recieves an array of characters with the format of
 * {
 * code: 'unicode',
 * name: 'special name, if provided',
 * ref: name or code
 * svg:  'full svg content required to render'
 * path: 'just the path from the svg content'
 * }
 *
 * @param fontSvgText SVG font definition containing all characters
 * @param charNameMap
 * @param callback
 */
function extractCharsFromFont(fontSvgText, charNameMap, callback) {

    var doc = new xmldom().parseFromString(fontSvgText, 'text/xml').documentElement,
        fontSpec = doc.getElementsByTagName('font')[0],
        defaultCharWidth = fontSpec.getAttribute('horiz-adv-x'),
        fontFace = doc.getElementsByTagName('font-face')[0],
        defaultCharHeight = fontFace.getAttribute('units-per-em'),
        defaultCharAscent = fontFace.getAttribute('ascent'),

        glyphs = doc.getElementsByTagName('glyph'),

        //"square" fonts tend to be based at the center (like glyphicon)
        //white other fonts tend to be based around the charAscent mark
        //so wen need to flip them with different adjustments
        translateOffset = defaultCharAscent,//(defaultCharWidth == defaultCharHeight ? defaultCharHeight : defaultCharAscent),
        iconSvg = [],
        charMap = charNameMap || {};


    for (var glyphCount = 0; glyphCount < glyphs.length; glyphCount++) {
        var glyph = glyphs.item(glyphCount);
        //some strange fonts put empty glyphs in them
        if (!glyph) continue;
        var iconCode = glyph.getAttribute('unicode'),
            pathData = glyph.getAttribute('d'),
            customWidthMatch = glyph.getAttribute('horiz-adv-x'),
            contentWidth = customWidthMatch ? customWidthMatch : defaultCharWidth;

        //some glyphs matched without a unicode value so we should ignore them
        if (!iconCode) continue;

        if (iconCode.indexOf('&#') != -1) {
            iconCode = iconCode.replace("&#x", "");
        }

        if (iconCode.length == 1) {
            iconCode = iconCode.charCodeAt(0).toString(16);
        }

        //Skip empty-looking glyphs
        if (!iconCode.length || !pathData || pathData.length < 10) continue;

        var name = charMap[iconCode] || glyph.getAttribute('glyph-name') || iconCode;

        iconSvg.push({
            code: iconCode,
            name: name,
            ref:  name ? name: iconCode,
            path: pathData,
            svg: '<svg xmlns="http://www.w3.org/2000/svg" ' +
                 'viewBox="0 0 ' + contentWidth + ' ' + defaultCharHeight + '">' +
                 '<g transform="scale(1,-1) translate(0 -' + (translateOffset) + ')">' +
                 '<path d="' + pathData + '"/>' +
            '</g></svg>'
        });
    }

    //Optimize all SVG to remove viewBox and compress the data path
    var optimizedCount = 0;
    iconSvg.forEach(function (ic, idx) {
        svgo.optimize(ic.svg, function (result) {

            //override SVG and path details with the clean result
            iconSvg[idx].svg = result.data;
            iconSvg[idx].path = result.data.match(/d="(.*?)"/)[1];

            if (++optimizedCount == iconSvg.length) {
                callback(iconSvg);
            }
        });
    });
}
module.exports = extractCharsFromFont;