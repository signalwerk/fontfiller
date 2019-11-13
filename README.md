# font-filler (only stub)
This is some random code for [opentype.js](https://opentype.js.org/) to generate "filler fonts" with missing characters of a Font.

The generated font will just contain the following characters:
* FIGURE SPACE (U+2007)
* NO-BREAK SPACE (U+00A0)
* THIN SPACE (U+2009)
* NARROW NO-BREAK SPACE (U+202F)
* (.nodef) – requred for every fonts

In the CSS you can then load the font with a subset:

```css
@font-face {
  font-family: "YourFillerFont";
  font-weight: 400;
  font-style: normal;
  src: url("./fontfiller.woff2") format("woff2"),
       url("./fontfiller.woff") format("woff");
  unicode-range: U+2007, U+00A0, U+2009, U+202f;
}
```

and use it like that:

```css

html {
  font-family: "YourFillerFont", "HereYourNormalFont", sans-serif;
}

```


## Todo
* Convert final TTF to WOFF with [ttf2woff](https://github.com/fontello/ttf2woff)
* Switch parser to the more robust [Typr.js](https://github.com/photopea/Typr.js) or [fontkit](https://github.com/foliojs/fontkit)
