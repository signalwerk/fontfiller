import React, { useReducer } from "react";
import DropFont from "./DropFont";
import { Provider } from "./Store";
import { reducer, initialState } from "./Reducer";
import Header from "./Header";
import FillSelect from "./FillSelect";

import "./App.css";

function App() {
  const useState = useReducer(reducer, initialState);

  return (
    <div className="App">
      <Provider value={useState}>
        <Header />
        <DropFont />
        <FillSelect />
      </Provider>

      <p>
        Code by Stefan Huber ·{" "}
        <a
          className="App-link"
          href="https://github.com/signalwerk/font-filler/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          OpenSource on GitHub
        </a>
      </p>

      <p>
        Thanks to{" "}
        <a
          className="App-link"
          href="https://github.com/opentypejs/opentype.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          opentype.js
        </a>
      </p>
    </div>
  );
}

export default App;
