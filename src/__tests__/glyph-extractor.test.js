import extactor from '../glyph-extractor'
import type {IconInformation} from '../glyph-extractor'
import fs from 'fs'

describe('Extracting known information from Font Awesome', () => {

    //Force the font text to be a string
    const sampleSvgFontText = fs.readFileSync(__dirname + '/extractor-data/fontawesome-webfont.svg', {encoding: 'utf8'})

    test('Finds the right number of glyphs', (done) => {
        const cback = (allCharacters: Array<IconInformation>) => {
            expect(allCharacters.length).toBe(5)
            done()
        }
        extactor(sampleSvgFontText, null, cback)
    })
})