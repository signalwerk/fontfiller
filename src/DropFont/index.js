import React, { useContext, useCallback, Fragment } from "react";
import opentype from "opentype.js";

import { useDropzone } from "react-dropzone";
import context from "../Store";
import { parseInfo } from "../util/parseInfo";
import { base64ArrayBuffer } from "./base64";

import "./styles.css";

// import opentypejs from 'opentype.js';

function DropFont() {
  const [state, dispatch] = useContext(context);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const reader = new FileReader();

      reader.onabort = () =>
        dispatch({
          type: "ERROR",
          payload: {
            error: "file reading was aborted",
          },
        });

      reader.onerror = () =>
        dispatch({
          type: "ERROR",
          payload: {
            error: "file reading has failed",
          },
        });
      reader.onload = () => {
        // Do whatever you want with the file contents

        const binaryStr = reader.result;

        try {
          let font = opentype.parse(binaryStr);

          dispatch({
            type: "LOAD",
            payload: {
              file: font,
              info: parseInfo(font),
            },
          });

          // const readerBase64 = new FileReader();

          // readerBase64.onloadend = function() {
          // var base64 = this.result;

          dispatch({
            type: "LOAD_BASE_64",
            payload: {
              fontBase64: base64ArrayBuffer(binaryStr),
            },
          });
          // };

          // readerBase64.readAsDataURL(binaryStr);
        } catch (err) {
          dispatch({
            type: "ERROR",
            payload: {
              error: err.message,
            },
          });
        }
      };

      if (acceptedFiles.length === 1) {
        acceptedFiles.forEach((file) => reader.readAsArrayBuffer(file));
      } else {
        dispatch({
          type: "ERROR",
          payload: {
            error: "please select only one file",
          },
        });
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Fragment>
      <div className="DropFont" {...getRootProps()}>
        {state.fontBase64 && (
          <style type="text/css">
            {`@font-face {
                font-family: "my-loaded-font";
                font-weight: normal;
                src: url("data:font/opentype;base64,${state.fontBase64}");
            }`}
          </style>
        )}

        <input {...getInputProps()} />
        {isDragActive ? (
          <span className="DropFont__caption">Drop the file here ...</span>
        ) : (
          <span className="DropFont__caption">
            Drop a font here, or click to select file
          </span>
        )}

        <br />
        <small>Support for WOFF, OTF, TTF</small>
        <br />

        {state.error && (
          <h2>
            <span role="img" aria-label="Warning">
              ⚠️
            </span>{" "}
            {state.error}
          </h2>
        )}
      </div>
    </Fragment>
  );
}

export default DropFont;
