// don't look at that code...

function shCollectData(font) {

    let conf = {
        fontSubfamily: 'Regular',
        unitsPerEm: 1000,
        sTypoAscender: 900,
        sTypoDescender: -100,
        sTypoLineGap: 50,
        sxHeight: 500,
        sCapHeight: 850
    }

    if (font.tables.head) {
        let table = font.tables.head
        conf.unitsPerEm = table.unitsPerEm || conf.unitsPerEm
    }

    if (font.tables["OS/2"]) {
        let table = font.tables["OS/2"]
        conf.sTypoAscender = table.sTypoAscender || conf.sTypoAscender
        conf.sTypoDescender = table.sTypoDescender || conf.sTypoDescender
        conf.sTypoLineGap = table.sTypoLineGap || conf.sTypoLineGap
        conf.sxHeight = table.sxHeight || conf.sxHeight
        conf.sCapHeight = table.sCapHeight || conf.sCapHeight
    }
    if (font.tables.name) {
        let table = font.tables.name

        conf.fontSubfamily = table.fontSubfamily.en || conf.fontSubfamily
    }



    let findGlyphByUni = function(glyphs, uni) {

        function findByUnicode(item) {
            return item.unicodes.includes(uni)
        }

        let key = Object.keys(glyphs).find(key => findByUnicode(glyphs[key]));

        if (key) {
            return glyphs[key];
        }

        return null;

    }

    let width = {
        FIGURE_SPACE: null,
        NO_BREAK_SPACE: null,
        THIN_SPACE: null,
        NARROW_NO_BREAK_SPACE: null,
    }



    let FIGURE_SPACE = findGlyphByUni(font.glyphs.glyphs, 8199)

    if (FIGURE_SPACE) {
        console.log("FIGURE_SPACE in font")
        width.FIGURE_SPACE = FIGURE_SPACE.advanceWidth
    } else {
        console.log("FIGURE_SPACE set from Glyph 'DIGIT ZERO' (U+0030)")
        let fallback = findGlyphByUni(font.glyphs.glyphs, 48)
        width.FIGURE_SPACE = fallback.advanceWidth
    }


    let NO_BREAK_SPACE = findGlyphByUni(font.glyphs.glyphs, 160)

    if (NO_BREAK_SPACE) {
        console.log("NO_BREAK_SPACE in font")
        width.NO_BREAK_SPACE = NO_BREAK_SPACE.advanceWidth
    } else {
        console.log("NO_BREAK_SPACE set from Glyph 'SPACE' (U+0020)")
        let fallback = findGlyphByUni(font.glyphs.glyphs, 32)
        width.NO_BREAK_SPACE = fallback.advanceWidth
    }




    let THIN_SPACE = findGlyphByUni(font.glyphs.glyphs, 8201)

    if (THIN_SPACE) {
        console.log("THIN_SPACE in font")
        width.THIN_SPACE = THIN_SPACE.advanceWidth
    } else {
        console.log("THIN_SPACE set to 60% width of Glyph 'SPACE' (U+0020)")
        let fallback = findGlyphByUni(font.glyphs.glyphs, 32)
        width.THIN_SPACE = parseInt(fallback.advanceWidth * .6)
    }

    let NARROW_NO_BREAK_SPACE = findGlyphByUni(font.glyphs.glyphs, 8239)

    if (NARROW_NO_BREAK_SPACE) {
        console.log("NARROW_NO_BREAK_SPACE in font")
        width.NARROW_NO_BREAK_SPACE = NARROW_NO_BREAK_SPACE.advanceWidth
    } else {
        if (THIN_SPACE) {
            console.log("NARROW_NO_BREAK_SPACE set from Glyph 'THIN SPACE' (U+2009)")
            let fallback = findGlyphByUni(font.glyphs.glyphs, 8201)
            console.log("NARROW_NO_BREAK_SPACE --", fallback.advanceWidth)
            width.NARROW_NO_BREAK_SPACE = fallback.advanceWidth
        } else {
            console.log("NARROW_NO_BREAK_SPACE set to 60% width of Glyph 'SPACE' (U+0020)")
            let fallback = findGlyphByUni(font.glyphs.glyphs, 32)
            width.NARROW_NO_BREAK_SPACE = parseInt(fallback.advanceWidth * .6)
        }
    }




    // The notdefGlyph always needs to be included.
    var notdefGlyph = new opentype.Glyph({
        name: '.notdef',
        advanceWidth: 650,
        path: new opentype.Path()
    });

    var FIGURE_SPACE_Glyph = new opentype.Glyph({
        name: 'uni2007',
        unicode: 8199,
        advanceWidth: width.FIGURE_SPACE,
        path: new opentype.Path()
    });


    var NO_BREAK_SPACE_Glyph = new opentype.Glyph({
        name: 'uni00A0',
        unicode: 160,
        advanceWidth: width.NO_BREAK_SPACE,
        path: new opentype.Path()
    });


    var THIN_SPACE_Glyph = new opentype.Glyph({
        name: 'uni2009',
        unicode: 8201,
        advanceWidth: width.THIN_SPACE,
        path: new opentype.Path()
    });

    var NARROW_NO_BREAK_SPACE_Glyph = new opentype.Glyph({
        name: 'uni202F',
        unicode: 8239,
        advanceWidth: width.NARROW_NO_BREAK_SPACE,
        path: new opentype.Path()
    });




    var glyphs = [notdefGlyph, FIGURE_SPACE_Glyph, NO_BREAK_SPACE_Glyph, THIN_SPACE_Glyph, NARROW_NO_BREAK_SPACE_Glyph];




    // Create the font using measurements + glyphs defined above.
    var font = new opentype.Font({
        familyName: 'FontFiller',
        styleName: conf.fontSubfamily,
        unitsPerEm: conf.unitsPerEm,
        ascender: conf.sTypoAscender,
        descender: conf.sTypoDescender,
        glyphs: glyphs
    });

    font.download();

}



opentype.load('./open-sans-v17-latin_latin-ext/open-sans-v17-latin_latin-ext-regular.woff', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
        shCollectData(font)
    }
});



opentype.load('./open-sans-v17-latin_latin-ext/open-sans-v17-latin_latin-ext-700.woff', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
        shCollectData(font)
    }
});
