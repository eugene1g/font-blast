

You can use font-blast to extract icons from any icon font - Font Awesome, Foundation, anything from Fontello etc. Font-blast will use the "super-font.svg " file to generate individual SVG/PNG files for each icon. 

There are several reasons why you may want to split up the icon font:

 - **Use the icons outside of web pages** - so you can import individual icons as SVGs into Sketch, Illustrator, PowerPoint, or any other app to use for visual mockups/presentations.
 - **Modify & repackage icons** - you can change a specific icon to suit your taste, then repackage the font (with something like Font Squirrel) 
 - **Get high quality PNGs** - high-quality PNGs with a transparent backgrounds of any or all icons in the font


## Installation

Font-blast is light-weight and has relatively few dependencies. Font-blast does not require PhantomJS or any other binaries on the system, so it should work pretty much everywhere. 

Note: PNG images are generated with the embedded batik-rasterizer, and you will need have java installed to do that (but it is not necessary for SVG generation).   

    $ npm install font-blast
    
    
## Barebones usage

You can generate icons from the command line by called the script with two parameters: the SVG file of the font, and the directory where inidivual icons should be placed -
### CLI

    $ font-blast [svg-font-file] [destination-dir]
    $ font-blast font-awesome.svg fa-icons/ 

 
### Node
    var fontBlast = require('font-blast');
    fontBlast('font-awesome.svg', 'fa-icons');
    
## Better Usage
### Smarter filenames
Just using the SVG file it is impossible to tell what the icon represents. Most icon-fonts have a mapping table which gives a human-friendly name to each unicode symbol.
See https://github.com/eugene1g/font-blast-examples

### Verification
...