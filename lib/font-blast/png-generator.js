//@flow
import path from "path";
import fs from "fs";
import mkdir from "mkdirp";
import { spawn, exec } from "child_process";

// var converterExec = "batik";
//Currently converts svg with apache batik
//Add handlers for more processors, like rsvg or GraphicsMagick

//Add an option to trim images on output
//through GM or IM
//gm mogrify -trim *
//Perhaps trim SVGs as well? no need, they can be imported into any SVG tool already

//add an option to optimize PNGs
//add an option to generate sprits from PNGs or SVGs

//
//function getRasterizerParams(resizerName, ops) {
//    var params = [];
//
//    if (resizerName == 'batik-rasterizer') {
//        params = ['-d', ops.toDir, '-maxh', ops.maxHeight, ops.sourceDir];
//    }
//
//    return params;
//}
export default function(sourceDir: string, targetDir: string, size: string) {
  if (!fs.existsSync(targetDir)) mkdir.sync(targetDir);

  const batikFile = path.resolve(__dirname, "../batik/batik-rasterizer.jar");
  const params = ["-jar", batikFile, "-d", targetDir, "-maxh", size, sourceDir];

  // let cmd = null;
  // let params = [];

  // if (converterExec == "batik") {
  // cmd = 'java';

  // }
  //var converterParams = getRasterizerParams(converterExec, {
  //    toDir:     saveToDir,
  //    maxHeight: size,
  //    sourceDir: sourceDir
  //});

  exec("java " + params.join(" "), function(err) {});
  // var coverter = spawn(cmd, params);
  // coverter.on('error', function (data) {
  //     //console.log(data.toString());
  // });
  //
  // coverter.stdout.on('data', function (data) {
  //     //console.log(data.toString());
  // });
  // coverter.stderr.on('data', function (data) {
  //     //console.log(data.toString());
  // });
}
