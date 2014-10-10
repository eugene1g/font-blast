"use strict";

var path  = require('path'),
    fs    = require('fs'),
    mkdir = require('mkdirp'),
    spawn = require('child_process').spawn,
    exec  = require('child_process').exec;


var converterExec = 'batik';
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
module.exports = function (sourceDir, targetDir, size) {
    if (!fs.existsSync(targetDir)) mkdir.sync(targetDir);

    var cmd = null, params = [];

    if (converterExec == 'batik') {
        cmd = 'java';
        var batikFile = path.resolve(__dirname, '../batik/batik-rasterizer.jar');
        params = ['-jar', batikFile, '-d', targetDir, '-maxh', size, sourceDir];
    }
    //var converterParams = getRasterizerParams(converterExec, {
    //    toDir:     saveToDir,
    //    maxHeight: size,
    //    sourceDir: sourceDir
    //});


    exec('java ' + params.join(' '), function (err) {
    });
    return;
    var coverter = spawn(cmd, params);
    coverter.on('error', function (data) {
        //console.log(data.toString());
    });

    coverter.stdout.on('data', function (data) {
        //console.log(data.toString());
    });
    coverter.stderr.on('data', function (data) {
        //console.log(data.toString());
    });
}