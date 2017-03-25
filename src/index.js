// @flow
import path from "path";
import fs from "graceful-fs";
import mkdir from "mkdirp";
import verify from "./verify";
import extractor from "./glyph-extractor";
import pngGenerator from "./png-generator";
import type { IconInformation } from "./glyph-extractor";

type UserConf = {
  png?: Boolean,
  filenames?: Object,
  icons?: Array<string>,
  cleanCharacter?: Function
};

const defaultConfig: UserConf = {};

function mainBlaster(
  fontFile: string,
  destinationFolder: string,
  userConfig: UserConf
) {
  const config = Object.assign({}, defaultConfig, userConfig || {});
  const svgFontContent = fs.readFileSync(fontFile, "utf-8");

  return extractor(
    svgFontContent,
    config.filenames,
    function(characterSvgs: Array<IconInformation>) {
      console.info(
        "Found " + characterSvgs.length + " available icons in the font"
      );
      console.info("Generating SVG content for each character...");

      const svgDir = path.resolve(
        process.cwd(),
        path.join(destinationFolder, "svg")
      );
      const pngDir = path.resolve(
        process.cwd(),
        path.join(destinationFolder, "png")
      );

      if (!fs.existsSync(svgDir)) mkdir.sync(svgDir);

      let savedIcons = [];
      characterSvgs.forEach((char: IconInformation) => {
        const filename = char.name ? char.name : char.code;
        //If a subset of icons set was requested, ignore any others that are not within the subset
        if (
          config.icons &&
          config.icons.length &&
          config.icons.indexOf(char.code) === -1 &&
          config.icons.indexOf(filename) === -1
        ) {
          return;
        }
        savedIcons.push(char);
        fs.writeFileSync(path.join(svgDir, filename + ".svg"), char.svg);
      });
      console.info("Saved " + savedIcons.length + " files to " + svgDir);

      if (config.png && !isNaN(config.png)) {
        console.info("Generating PNG images - this may take a minute...");
        pngGenerator(svgDir, pngDir, config.png);
      }

      verify(svgFontContent, savedIcons, config.png, destinationFolder);
    },
    config.cleanCharacter
  );
}

export default mainBlaster;
