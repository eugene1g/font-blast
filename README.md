## What is this
Icon Fonts are cool - Font Awesome/Foundation/Fontello/etc all have great-looking and well thought out icons.
`font-blast` can extract those cool icons from the font file, and create individual SVG/PNG files for every one of them.

## Why?
 - **Use cool icons outside of web pages**.  If you have individual icons as SVGs, you can import them into Sketch, Illustrator, PowerPoint, or any other app to use for visual mockups/presentations.
 - **Modify & repackage icons**. It's easy to change an individual SVG file, then repackage all images back into an icon-font (with e.g. Font Squirrel)
 - **Get high quality PNGs**. Generate high-res PNGs with a transparent backgrounds to use in native applications, emails, etc.


## Installation
Font-blast does not require PhantomJS or any other native binaries, so it should work pretty much everywhere.

Note: PNG images are generated with the embedded batik-rasterizer, and you will need have java installed to do that. Evil Java is not required for generating SVG files.

    $ npm install font-blast
    
    
## CLI usage

You can generate icons from the command line by called the script with two parameters: the SVG file of the font, and the directory where inidivual icons should be placed -
### CLI

    $ wget https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/fonts/fontawesome-webfont.svg
    $ bin/font-blast.js fontawesome-webfont.svg fa-icons/

 
### Node
    var fontBlast = require('font-blast');
    fontBlast('font-awesome.svg', 'fa-icons');
    
## Better Usage
### Smarter filenames
Just using the SVG file it is impossible to tell what the icon represents. Most icon-fonts have a mapping table which gives a human-friendly name to each unicode symbol.
See https://github.com/eugene1g/font-blast-examples