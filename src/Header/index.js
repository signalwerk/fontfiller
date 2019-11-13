import React, { useContext } from "react";
import context from "../Store";
import { codePoints, requiredChars } from "../util/parseInfo";

function Header() {
  const [state] = useContext(context);

  return (
    <header className="Header">
      <h1>FontFiller</h1>
      <small>
        Generate missing whitespace characters for incomplete fonts.
      </small>

      <h3>Supported characters</h3>
      <ul>
        {Object.keys(requiredChars).map(key => (
          <li>
            <small>U+{codePoints[key]}</small> {key}
          </li>
        ))}
      </ul>
      {state.error && (
        <h2>
          <span role="img" aria-label="Warning">
            ⚠️
          </span>{" "}
          {state.error}
        </h2>
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

export default Header;
