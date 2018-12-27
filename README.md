# Stub

This is some random code for [opentype.js](https://opentype.js.org/) to generate "filler fonts". containing missing characters for correct typography based on a incomplete font.

The generated font will just ontain the following characters:


### FIGURE SPACE (U+2007)
* Text: ' '
* Unicode DEZ: `&#8199;`
* Unicode HEX: `&#x2007;`

### NO-BREAK SPACE (U+00A0)
* Text: ' '
* HTML: `&nbsp;`
* Unicode DEZ: `&#160;`
* Unicode HEX: `&#x00A0;`

### THIN SPACE (U+2009)
* Text: ' '
* HTML: `&thinsp;`
* Unicode DEZ: `&#8201;`
* Unicode HEX: `&#x2009;`

### NARROW NO-BREAK SPACE (U+202F)
* Text: ' '
* Unicode DEZ: `&#8239;`
* Unicode HEX: `&#x202f;`


In the CSS you can then load the font with a subset:

```css
@font-face {
  font-family: "YourFillerFont";
  font-weight: 400;
  font-style: normal;
  src: url("./font/fontfiller-regular-webfont.woff2") format("woff2"),
       url("./font/fontfiller-regular-webfont.woff") format("woff");
  unicode-range: U+2007, U+00A0, U+2009, U+202f;
}
```

and use it like that:

```css

html {
  font-family: "YourFillerFont", "HereYourNormalFont", sans-serif;
}

```



