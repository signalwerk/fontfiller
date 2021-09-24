// import { Glyph, Path, Font } from "opentype.js";
import opentype from "opentype.js";

export const codePoints = {
  "ZERO WIDTH SPACE": "200B",
  SPACE: "0020",
  "NO-BREAK SPACE": "00A0",
  "THIN SPACE": "2009",
  "NARROW NO-BREAK SPACE": "202F",
  "HAIR SPACE": "200A",
  "SIX-PER-EM SPACE": "2006",
  "FOUR-PER-EM SPACE": "2005",
  "THREE-PER-EM SPACE": "2004",
  "EN SPACE": "2002",
  "EM SPACE": "2003",
  "FIGURE SPACE": "2007",
  "PUNCTUATION SPACE": "2008",
  "DIGIT ZERO": "0030",
  "FULL STOP": "002E"
};

export const examples = {
  "ZERO WIDTH SPACE":
    "🟢 This|Is|A|Very|Long|Test|Word|This|Is|A|Very|Long|Test|Word|This|Is|A|Very|Long|Test|Word|This|Is|A|Very|Long|Test|Word|This|Is|A|Very|Long|Test|Word|This|Is|A|Very|Long|Test|Word|This|Is|A|Very|Long|Test|Word",
  SPACE: "HHH|HHH¶nnn|nnn",
  "NO-BREAK SPACE":
    "🔴 HHHHHHHHHHHHHHHHHHHHHHHHHHHH|HHHHHHHHHHHHHHHHHHHHHHHHHHHH¶🟢 HHHHHHHHHHHHHHHHHHHHHHHHHHHH#HHHHHHHHHHHHHHHHHHHHHHHHHHHH",
  "THIN SPACE": "🔴 800|km¶🟢 800#km",
  "NARROW NO-BREAK SPACE": "🔴 800|km¶🟢 800#km",
  "HAIR SPACE": "🔴 800|000|000¶🟢 800#000#000",
  "SIX-PER-EM SPACE": "🔴 →|←¶🟢 →#←",
  "FOUR-PER-EM SPACE": "🔴 →|←¶🟢 →#←",
  "THREE-PER-EM SPACE": "🔴 →|←¶🟢 →#←",
  "EN SPACE": "🔴 →|←¶🟢 →#←",
  "EM SPACE": "🔴 →|←¶🟢 →#←",
  "FIGURE SPACE": "🔴 00|00¶🟢 00#00",
  "PUNCTUATION SPACE": "🔴 00|00¶🟢 00#00"
};

export const requiredChars = {
  SPACE: {
    fallback: false
  },
  "ZERO WIDTH SPACE": {
    fallback: [{ char: "SPACE", factor: 0 }]
  },
  "NO-BREAK SPACE": {
    fallback: [{ char: "SPACE" , factor: 1 }]
  },
  "THIN SPACE": {
    fallback: [{ char: "SPACE", factor: 0.7 }]
  },
  "NARROW NO-BREAK SPACE": {
    fallback: [{ char: "THIN SPACE", factor: 1 }, { char: "SPACE", factor: 0.7 }]
  },
  "HAIR SPACE": {
    fallback: [{ char: "SPACE", factor: 0.3 }]
  },
  "SIX-PER-EM SPACE": {
    fallback: [{ char: "EM SPACE", factor: 1 / 6 }]
  },
  "FOUR-PER-EM SPACE": {
    fallback: [{ char: "EM SPACE", factor: 1 / 4 }]
  },
  "THREE-PER-EM SPACE": {
    fallback: [{ char: "EM SPACE", factor: 1 / 3 }]
  },
  "EN SPACE": {
    fallback: [{ char: "EM SPACE", factor: 1 / 2 }]
  },
  "EM SPACE": {
    fallback: false
  },
  "FIGURE SPACE": {
    fallback: [{ char: "DIGIT ZERO", factor: 1 }]
  },
  "PUNCTUATION SPACE": {
    fallback: [{ char: "FULL STOP", factor: 1 }]
  }
};

export const findFallbackWidth = (key, glyphs) => {
  const fallback = requiredChars[key].fallback;

  for (var i = 0; i < fallback.length; i++) {
    const fallbackChar = glyphs[fallback[i].char];
    if (fallbackChar && fallbackChar.exists) {
      return {
        char: fallback[i].char,
        width: fallbackChar.width,
        factor: fallback[i].factor
      };
    }
  }
  return false;
};

const findByUnicode = (glyph, uni) => {
  return glyph.unicodes.includes(uni);
};

const findGlyphByUni = (glyphs, uni) => {
  let key = Object.keys(glyphs).find(key => findByUnicode(glyphs[key], uni));

  if (key) {
    return glyphs[key];
  }

  return null;
};

export const writeFont = info => {
  let glyphs = [];
  // The notdefGlyph always needs to be included.
  glyphs.push(
    new opentype.Glyph({
      name: ".notdef",
      advanceWidth: 650,
      path: new opentype.Path()
    })
  );

  Object.keys(info.glyphs).forEach(key => {
    const glyph = info.glyphs[key];

    if (glyph.exists === false && glyph.fallback) {
      const dec = parseInt(codePoints[key], 16);
      const width = Math.round(glyph.fallback.width * glyph.fallback.factor);

      let g = new opentype.Glyph({
        name: `uni${codePoints[key]}`,
        unicode: dec,
        advanceWidth: width,
        path: new opentype.Path()
      });

      // fix bug
      // see https://github.com/opentypejs/opentype.js/pull/430
      g.advanceWidth = width;

      glyphs.push(g);
    }
  });

  // Create the font using measurements + glyphs defined above.
  var font = new opentype.Font({
    familyName: "FontFiller",
    styleName: info.fontSubfamily,
    unitsPerEm: info.unitsPerEm,
    ascender: info.os2.sTypoAscender,
    descender: info.os2.sTypoDescender,
    glyphs: glyphs
  });

  font.tables.os2 = {
    ...font.tables.os2,
    sTypoLineGap: info.os2.sTypoLineGap,
    sxHeight: info.os2.sxHeight,
    sCapHeight: info.os2.sCapHeight
  };

  font.download();
};

export const parseInfo = font => {
  let conf = {
    unitsPerEm: null,
    fontSubfamily: null,
    os2: {
      sTypoAscender: null,
      sTypoDescender: null,
      sTypoLineGap: null,
      sxHeight: null,
      sCapHeight: null
    },
    glyphs: null
  };

  if (font.tables.head) {
    let table = font.tables.head;
    conf.unitsPerEm = table.unitsPerEm;
  }

  if (font.tables.name) {
    let table = font.tables.name;
    conf.fontSubfamily = table.fontSubfamily.en;
  }

  if (font.tables.os2) {
    let table = font.tables.os2;
    conf.os2.sTypoAscender = table.sTypoAscender;
    conf.os2.sTypoDescender = table.sTypoDescender;
    conf.os2.sTypoLineGap = table.sTypoLineGap;
    conf.os2.sxHeight = table.sxHeight;
    conf.os2.sCapHeight = table.sCapHeight;
  }

  conf.glyphs = {};
  Object.keys(codePoints).forEach(key => {
    const hex = codePoints[key];
    conf.glyphs[key] = {};

    let glyph = findGlyphByUni(font.glyphs.glyphs, parseInt(hex, 16));

    conf.glyphs[key].exists = !!glyph;

    if (glyph) {
      conf.glyphs[key].width = glyph.advanceWidth;
    }
  });

  Object.keys(conf.glyphs).forEach(key => {
    if (!conf.glyphs[key].exists) {
      conf.glyphs[key].fallback = findFallbackWidth(key, conf.glyphs);
    }
  });

  return conf;
};
