import React, { useContext, useCallback, Fragment } from "react";
import { parse } from "opentype.js";

import { useDropzone } from "react-dropzone";
import context from "../Store";
import { parseInfo } from "../util/parseInfo";

import "./styles.css";

// import opentypejs from 'opentype.js';

function DropFont() {
  const [, dispatch] = useContext(context);

  const onDrop = useCallback(
    acceptedFiles => {
      const reader = new FileReader();

      reader.onabort = () =>
        dispatch({
          type: "ERROR",
          payload: {
            error: "file reading was aborted"
          }
        });

      reader.onerror = () =>
        dispatch({
          type: "ERROR",
          payload: {
            error: "file reading has failed"
          }
        });
      reader.onload = () => {
        // Do whatever you want with the file contents

        const binaryStr = reader.result;

        try {
          let font = parse(binaryStr);

          dispatch({
            type: "LOAD",
            payload: {
              file: font,
              info: parseInfo(font)
            }
          });
        } catch (err) {
          dispatch({
            type: "ERROR",
            payload: {
              error: err.message
            }
          });
        }
      };

      if (acceptedFiles.length === 1) {
        acceptedFiles.forEach(file => reader.readAsArrayBuffer(file));
      } else {
        dispatch({
          type: "ERROR",
          payload: {
            error: "please select only one file"
          }
        });
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Fragment>
      <div className="DropFont" {...getRootProps()}>
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
      </div>
    </Fragment>
  );
}

export default DropFont;
