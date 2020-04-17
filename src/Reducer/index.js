export const initialState = {
  file: null,
  fontBase64: null,
  info: null,
  error: null
};

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

    case "LOAD_BASE_64":
      return {
        ...state,
        fontBase64: action.payload.fontBase64,
        error: null
      };
    default:
      return state;
  }
};
