// @flow

import path from "path";
import fs from "graceful-fs";
import svg2ttf from "svg2ttf";

function generateVerifyFile(svgFont: string, iconSet, withPng, toFolder) {
  //Convert the SVG file into a TTF file so that more browsers can parse and show it
  const ttf = svg2ttf(svgFont, {});
  fs.writeFileSync(
    path.join(toFolder, "source-font.ttf"),
    new Buffer(ttf.buffer)
  );

  //load the template for the verification file which contains some generic HTML
  let htmlTemplate = fs.readFileSync(
    path.join(__dirname, "..", "/resources/verify.html"),
    "utf-8"
  );
  let iconContent = [];
  let cssRules = [];

  //Add a header to to the table
  iconContent.push(
    `<div class="row">
    <div class="col icon-ref header">&nbsp;</div>
    <div class="col header">Font Icon</div>
    <div class="col header">SVG Image</div>
    ${withPng ? '<div class="col header">PNG Image</div>' : ""}
    </div>`
  );

  //for reach icon in the set, add a reference from the original font
  //then add a reference to the generated SVG image
  //then optionally add the reference to the PNG image if one was created

  iconSet.forEach(function(iconInfo) {
    cssRules.push(
      `.blast-${iconInfo.ref}:before { content: "\\${iconInfo.code}"}\n`
    );
    iconContent.push(
      `
      <div class="row">
        <div class="col icon-ref">${iconInfo.ref}</div>
        <div class="col"><i class="blast-${iconInfo.ref}"></i></div>
        <div class="col"><img class="svg-icon" src="svg/${iconInfo.ref}.svg"/></div>
        ${withPng ? '<div class="col"><img class="png-icon" src="png/' + iconInfo.ref + '.png"/></div>' : ""}
        </div>`
    );
  });
  //poor man's templating
  htmlTemplate = htmlTemplate.replace(/_height_/g, 130);
  htmlTemplate = htmlTemplate.replace(/_iconRules_/g, cssRules.join(""));
  htmlTemplate = htmlTemplate.replace(/_iconContent_/g, iconContent.join(""));
  //generate the html test file
  fs.writeFileSync(path.join(toFolder, "verify.html"), htmlTemplate);
}

export default generateVerifyFile;
