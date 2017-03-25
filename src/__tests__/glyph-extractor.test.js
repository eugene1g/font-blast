import extactor from '../glyph-extractor'
import type {IconInformation} from '../glyph-extractor'
import fs from 'fs'

describe('Extracting known information from Font Awesome', () => {

    //Force the font text to be a string
    const sampleSvgFontText = fs.readFileSync(__dirname + '/extractor-data/fontawesome-webfont.svg', {encoding: 'utf8'})

    test('Finds the right number of glyphs - with callback', (done) => {
        const cback = (allCharacters: Array<IconInformation>) => {
            expect(allCharacters.length).toBe(5)
        }
        var promise = extactor(sampleSvgFontText, null, cback)

        expect(promise).not.toBe(undefined)

        promise.then(function(){
            done()
        })
    })

    test('Finds the right number of glyphs - without callback', (done) => {
        var promise = extactor(sampleSvgFontText, null)

        expect(promise).not.toBe(undefined)

        promise.then((allCharacters: Array<IconInformation>) => {
            expect(allCharacters.length).toBe(5)
            done()
        })
    })
})