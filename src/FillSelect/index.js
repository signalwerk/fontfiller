import React, { useContext, Fragment } from "react";
import context from "../Store";
import { codePoints, examples } from "../util/parseInfo";
import "./styles.css";

function FillSelect() {
  const [state] = useContext(context);

  if (!state.info) {
    return null;
  }

  return (
    <div className="FillSelect">
      <h2>Examples</h2>

      <ul className="FillSelect__list">
        {Object.keys(state.info.glyphs).map(
          (key) =>
            state.info.glyphs &&
            state.info.glyphs[key].exists === false &&
            state.info.glyphs[key].fallback && (
              <li className="FillSelect__item FillSelect__item--missing">
                {examples[key].split("¶").map((line) => (
                  <h3 className="FillSelect__example">
                    {line

                      .split("|")
                      .join(String.fromCharCode(parseInt(codePoints[key], 16)))

                      .split("#")
                      .map((item, i, arr) => (
                        <Fragment>
                          <span>{item}</span>
                          {i !== arr.length - 1 && (
                            <span
                              className="FillSelect__spaceMock"
                              style={{
                                width: `${
                                  (1 / state.info.unitsPerEm) *
                                  (state.info.glyphs[key].fallback.width *
                                    state.info.glyphs[key].fallback.factor)
                                }em`,
                              }}
                            ></span>
                          )}
                        </Fragment>
                      ))}
                  </h3>
                ))}
                <span role="img" aria-label="info">
                  🔴
                </span>{" "}
                <small>U+{codePoints[key]}</small> {key} not in font <br />
                <span>
                  <span role="img" aria-label="new">
                    🟢
                  </span>{" "}
                  <small>
                    U+{codePoints[state.info.glyphs[key].fallback.char]}
                  </small>{" "}
                  {state.info.glyphs[key].fallback.char} used to generate
                  fallback in FontFiller{" "}
                  {state.info.glyphs[key].fallback.factor !== 1 ? (
                    <span>
                      (Width × {state.info.glyphs[key].fallback.factor})
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default FillSelect;
