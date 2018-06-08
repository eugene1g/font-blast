//@flow
import SVGO from "svgo";
import { DOMParser } from "xmldom";

const svgo = new SVGO({});

/**
 * Optimizes the SVG text and compresses the data 'path' for all lines
 * @param svgText Original SVG content
 * @reutrn string New SVG content
 */
const optimizeSvgText = (svgText: string): Promise<string> => {
  type svgGoResult = {
    data: string,
    info: Object
  };
  return new Promise((resolve, reject) => {
    svgo.optimize(svgText, (result: svgGoResult) => {
      resolve(result.data);
    });
  });
};

export type IconInformation = {
  code: string,
  name: string,
  ref: string,
  svg: string
};

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
 * @param processCharInfoFn A function that provides the character filename
 * Array<IconInformation>
 */
function extractCharsFromFont(
  fontSvgText: string,
  charNameMap: Object,
  callbackFn: Function,
  processCharInfoFn: ?Function
): void {
  const doc = new DOMParser().parseFromString(
    fontSvgText,
    "text/xml"
  ).documentElement;
  const fontSpec = doc.getElementsByTagName("font")[0];
  const defaultCharWidth = fontSpec.getAttribute("horiz-adv-x");
  const fontFace = doc.getElementsByTagName("font-face")[0];
  const defaultCharHeight = fontFace.getAttribute("units-per-em");
  const defaultCharAscent = fontFace.getAttribute("ascent");
  const glyphs = doc.getElementsByTagName("glyph");

  //"square" fonts tend to be based at the center (like glyphicon)
  //white other fonts tend to be based around the charAscent mark
  //so when need to flip them with different adjustments
  //(defaultCharWidth == defaultCharHeight ? defaultCharHeight : defaultCharAscent),
  const translateOffset = defaultCharAscent;
  const charMap = charNameMap || {};
  const cleanCharacter = processCharInfoFn || ((char: string): string => char);

  let dataOnGlyphs: Array<IconInformation> = [];
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    //some strange fonts put empty glyphs in them
    if (!glyph) continue;
    let iconCode = glyph.getAttribute("unicode");
    const pathData = glyph.getAttribute("d");
    const customWidthMatch = glyph.getAttribute("horiz-adv-x");
    const contentWidth = customWidthMatch ? customWidthMatch : defaultCharWidth;

    //some glyphs matched without a unicode value so we should ignore them
    if (!iconCode) continue;

    // handle encoded values
    if (iconCode.indexOf("&#") !== -1) {
      iconCode = iconCode.replace("&#x", "");
    }
    // handle unencoded values
    else {
      iconCode = iconCode.codePointAt(0).toString(16);
    }

    //Skip empty-looking glyphs
    if (!iconCode.length || !pathData || pathData.length < 10) continue;

    const useCharacterName = charMap[iconCode] ||
      glyph.getAttribute("glyph-name") ||
      iconCode;

    const charInfo: IconInformation = {
      code: iconCode,
      name: useCharacterName,
      ref: useCharacterName || iconCode,
      path: pathData,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${contentWidth} ${defaultCharHeight}">
        <g transform="scale(1,-1) translate(0 -${translateOffset})">
            <path d="${pathData}"/>
        </g></svg>`
    };
    dataOnGlyphs = dataOnGlyphs.concat(charInfo);
  }

  const cleanAllPromises = dataOnGlyphs.map((charInfo: IconInformation) => {
    return optimizeSvgText(charInfo.svg).then(cleanSvg => {
      let newInfo = Object.assign({}, charInfo, {
        svg: cleanSvg,
        path: cleanSvg.match(/d="(.*?)"/)[1]
      });
      if (cleanCharacter) newInfo = cleanCharacter(newInfo);
      return newInfo;
    });
  });

  var promise = Promise.all(cleanAllPromises);
  if (callbackFn){
    promise = promise.then(callbackFn);
  }
  return promise;
}

export default extractCharsFromFont;
