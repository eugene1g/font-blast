#!/usr/bin/env node
import fs from "graceful-fs";
import pckg from "../package.json";
import program from "commander";
import blaster from "./index";
import type { UserConf } from "./index";

program
  .version(pckg.version)
  .usage("[options] svg-font.svg outputDir")
  .option(
    "-i, --icons <icon-refs>",
    "Limit the output to the selected icons. Icons can be provided with their unicode value or the full reference",
    function(val) {
      return val ? val.split(",") : [];
    }
  )
  .option(
    "-p, --png <heightInPx>",
    "Include this to generate PNG files. Please note you will need to have an executable binary in your path for 'batik-rasterizer'",
    parseInt
  )
  .option(
    "-c, --color <colorcode>",
    "Set the color of icons in the output (relevant mainly for PNG files)"
  )
  .parse(process.argv);

const svgFontFile = program.args[0], outputDir = program.args[1];
if (!svgFontFile || !outputDir) {
  program.help();
}

if (!fs.existsSync(svgFontFile)) {
  console.error("This provided SVG font file does not exist");
  process.exit();
}

const config: UserConf = {
  icons: program.icons,
  png: program.png,
  color: program.color
};
blaster(svgFontFile, outputDir, config);
