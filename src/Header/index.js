import React from "react";

const version = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
  .format(new Date(parseInt(process.env.REACT_APP_BUILD_TIME, 10) * 1000))
  .split('.')
  .reverse()
  .join('-');

function Header() {
  return (
    <header className="Header">
      <hr />
      <h1>FontFiller</h1>
      <hr />
      <p>
        Inspect fonts and generate missing whitespace characters
        for&nbsp;incomplete&nbsp;fonts.
      </p>

      <p className="small">
        {"Code by Stefan Huber · "}
        <a
          className="App-link"
          href="https://github.com/signalwerk/fontfiller/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          OpenSource on GitHub
        </a>
        {" · "}
        <span className="version">Version {version}</span>
      </p>
      <hr />
    </header>
  );
}

export default Header;
