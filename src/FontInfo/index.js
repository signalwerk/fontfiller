import React, { useContext, Fragment } from "react";
import context from "../Store";
import { codePoints, requiredChars, writeFont } from "../util/parseInfo";

function FontInfo() {
  const [state] = useContext(context);

  return (
    <header className="FontInfo">
      <h3>Inspected characters</h3>

      <table>
        <thead>
          <tr>
            <th>Codepoint</th>
            <th>in Font</th>
            <th className="right">Generate in FontFiller</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(requiredChars).map(key => (
            <tr key={key}>
              <td>
                <small>U+{codePoints[key]}</small> {key}
              </td>
              <td>
                {state.info &&
                  state.info.glyphs &&
                  (state.info.glyphs[key].exists ? "🟢 YES" : "🔴 NO")}

                {!state.info && "..."}
              </td>
              <td className="right">
                {state.info &&
                  state.info.glyphs &&
                  state.info.glyphs[key].exists === false &&
                  (state.info.glyphs[key].fallback ? "YES 🟢" : "")}
                {!state.info && "..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {state.info && (
        <Fragment>
          <button onClick={() => writeFont(state.info)}>
            Download FontFiller (TTF)
          </button>

          <h2>Convert & load</h2>
          <p>
            After downloading the fillter-font convert the TTF to Woff/Woff2
            with{" "}
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
    unicode-range: ${Object.keys(state.info.glyphs)
      .filter(
        key =>
          state.info.glyphs &&
          state.info.glyphs[key].exists === false &&
          state.info.glyphs[key].fallback
      )
      .map(key => "U+" + codePoints[key])
      .join(", ")};
}`}
          </pre>
          <p>and use it like that:</p>
          <pre>
            {`html {
    font-family: "YourFillerFont", "HereYourNormalFont", sans-serif;
}`}
          </pre>
        </Fragment>
      )}

      {state.info && (
        <details>
          <summary>Debug-Infos</summary>
          <pre>{JSON.stringify(state.info, null, 2)}</pre>
        </details>
      )}
      <br />
    </header>
  );
}

export default FontInfo;
