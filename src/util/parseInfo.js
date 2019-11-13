// import { Glyph, Path, Font } from "opentype.js";
import { Glyph, Path, Font } from "opentype.js/src/opentype.js";

export const codePoints = {
  "NO-BREAK SPACE": "00A0",
  "THIN SPACE": "2009",
  "NARROW NO-BREAK SPACE": "202F",
  "FIGURE SPACE": "2007",
  "DIGIT ZERO": "0030",
  SPACE: "0020"
};

export const requiredChars = {
  "NO-BREAK SPACE": {
    fallback: [{ char: "SPACE" }]
  },
  "THIN SPACE": {
    fallback: [{ char: "SPACE", factor: 0.7 }]
  },
  "NARROW NO-BREAK SPACE": {
    fallback: [{ char: "THIN SPACE" }, { char: "SPACE", factor: 0.7 }]
  },
  "FIGURE SPACE": {
    fallback: [{ char: "DIGIT ZERO" }]
  }
};

export const findWidth = (fallback, widths) => {
  for (var i = 0; i < fallback.length; i++) {
    let fallbackWidth = widths[fallback[i].char];
    if (fallbackWidth) {
      return {
        char: fallback[i].char,
        width: fallbackWidth,
        factor: fallback[i].factor || 1
      };
    }
  }
  return {};
};

export const requiredFillers = widths => {
  return Object.keys(requiredChars).map(key => {
    let exists = false;
    let fallback = {};
    if (widths[key]) {
      exists = true;
    } else {
      fallback = findWidth(requiredChars[key].fallback, widths);
    }
    return {
      name: key,
      hex: codePoints[key],
      exists,
      fallback
    };
  });
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

const findGlyphWidthByUni = (glyphs, uni) => {
  let glyph = findGlyphByUni(glyphs, uni);
  if (glyph) {
    return glyph.advanceWidth;
  }
  return null;
};

export const writeFont = (info, fallback) => {
  console.log({ info, fallback });
  let glyphs = [];
  // The notdefGlyph always needs to be included.
  glyphs.push(
    new Glyph({
      name: ".notdef",
      advanceWidth: 650,
      path: new Path()
    })
  );

  fallback.forEach(item => {
    glyphs.push(
      new Glyph({
        name: `uni${item.hex}`,
        unicode: parseInt(item.hex, 16),
        advanceWidth: item.fallback.width * item.fallback.factor,
        path: new Path()
      })
    );
  });

  // Create the font using measurements + glyphs defined above.
  var font = new Font({
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

  // var test = new Font({
  //   familyName: "TestFont",
  //   styleName: "Bold",
  //   unitsPerEm: 2048,
  //   ascender: 1500,
  //   descender: -500,
  //   glyphs: [
  //     new Glyph({
  //       name: ".notdef",
  //       advanceWidth: 650,
  //       path: new Path()
  //     })
  //   ]
  // });
  //
  // test.tables.os2 = {
  //   ...test.tables.os2,
  //   sxHeight: 1100,
  //   sCapHeight: 1400
  // };
  // test.download();

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
    width: {
      FIGURE_SPACE: null,
      NO_BREAK_SPACE: null,
      THIN_SPACE: null,
      NARROW_NO_BREAK_SPACE: null,
      ZERO: null,
      SPACE: null
    }
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

  conf.width = {};
  Object.keys(codePoints).forEach(
    key =>
      (conf.width[key] = findGlyphWidthByUni(
        font.glyphs.glyphs,
        parseInt(codePoints[key], 16)
      ))
  );

  return conf;
};
