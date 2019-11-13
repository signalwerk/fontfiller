export const initialState = {
  file: null,
  info: null,
  error: null
};

// export const initialState = {
//   file: null,
//   info: {
//   "unitsPerEm": 2048,
//   "fontSubfamily": "Bold",
//   "os2": {
//     "sTypoAscender": 1567,
//     "sTypoDescender": -492,
//     "sTypoLineGap": 132,
//     "sxHeight": 1118,
//     "sCapHeight": 1462
//   },
//   "width": {
//     "NO-BREAK SPACE": 532,
//     "THIN SPACE": 410,
//     "NARROW NO-BREAK SPACE": null,
//     "FIGURE SPACE": null,
//     "DIGIT ZERO": 1169,
//     "SPACE": 532
//   }
// },
//   error: null
// };

export const reducer = (state, action) => {
  switch (action.type) {
    case "ERROR":
      return {
        ...state,
        error: action.payload.error,
        file: null,
        info: null
      };

    case "LOAD":
      return {
        ...state,
        file: action.payload.file,
        info: action.payload.info,
        error: null
      };
    default:
      return state;
  }
};
