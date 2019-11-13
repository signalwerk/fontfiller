import React, { useContext, Fragment } from "react";
import context from "../Store";
import { requiredFillers, codePoints, writeFont } from "../util/parseInfo";
import "./styles.css";

function FillSelect() {
  const [state] = useContext(context);

  if (!state.info) {
    return null;
  }

  let generate = requiredFillers(state.info.width);

  return (
    <div className="FillSelect">
      <ul className="FillSelect__list">
        {generate.map(item =>
          item.exists ? (
            <li className="FillSelect__item FillSelect__item--exists">
              <span role="img" aria-label="OK">
                ✅
              </span>{" "}
              <small>U+{codePoints[item.name]}</small> {item.name} in font
            </li>
          ) : (
            <li className="FillSelect__item FillSelect__item--missing">
              <span role="img" aria-label="info">
                ℹ️
              </span>{" "}
              <small>U+{codePoints[item.name]}</small> {item.name} not in font{" "}
              <br />
              {item.fallback.char ? (
                <span>
                  <span role="img" aria-label="new">
                    🆕
                  </span>{" "}
                  <small>U+{codePoints[item.fallback.char]}</small>{" "}
                  {item.fallback.char} used to generate fallback{" "}
                  {item.fallback.factor !== 1 ? (
                    <span>(Width × {item.fallback.factor})</span>
                  ) : (
                    ""
                  )}
                </span>
              ) : (
                <Fragment>
                  <span role="img" aria-label="error">
                    🆕
                  </span>
                  <span> no fallback found </span>
                </Fragment>
              )}
            </li>
          )
        )}
      </ul>
      <button
        onClick={() =>
          writeFont(state.info, generate.filter(item => item.fallback.char))
        }
      >
        Download Filler Font (TTF)
      </button>
      <h2>Convert & load</h2>
      <p>
        After downloading the fillter-font convert the TTF to Woff/Woff2 with{" "}
        <a
          className="App-link"
          href="https://www.fontsquirrel.com/tools/webfont-generator"
          target="_blank"
          rel="noopener noreferrer"
        >
          Font Squirrel.
        </a>{" "}
        Then include like that:
      </p>
      <pre>
        {`@font-face {
  font-family: "YourFillerFont";
  font-weight: 400;
  font-style: normal;
  src: url("./fontfiller.woff2") format("woff2"),
       url("./fontfiller.woff") format("woff");
  unicode-range: ${generate
    .filter(item => item.fallback.char)
    .map(item => "U+" + codePoints[item.fallback.char])
    .join(", ")};
}`}
      </pre>
      <p>and use it like that:</p>
      <pre>
        {`html {
  font-family: "YourFillerFont", "HereYourNormalFont", sans-serif;
}`}
      </pre>
    </div>
  );
}

export default FillSelect;
