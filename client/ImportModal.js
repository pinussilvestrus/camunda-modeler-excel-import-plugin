/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{ children }</h2>);
const Body = Modal.Body || (({ children }) => <div>{ children }</div>);
const Footer = Modal.Footer || (({ children }) => <div>{ children }</div>);

import Dropzone from './Dropzone';

const path = require('path');

export default function ImportModal(props) {
  const {
    initValues,
    getSheets,
    onClose
  } = props;

  const [ inputFile, setInputFile ] = useState(initValues.inputFile);

  const [ chosenFileText, setChosenFileText ] = useState('No file selected.');

  const [ rawSheets, setRawSheets ] = useState([]);
  const [ sheets, setSheets ] = useState([]);

  // set defaults
  useEffect(() => {
    const sheets = rawSheets.map(() => {
      return {
        amountOutputs: 1,
        hitPolicy: 'Unique'
      };
    });

    setSheets(sheets);
  }, [ rawSheets ]);

  const getSheet = (idx, property) => {
    const sheet = Object.assign({}, sheets[idx]);

    if (sheet && property) {
      return sheet[property];
    }

    return sheet || {};
  };
  const updateSheet = (idx, property, value) => {
    let updatedSheet = getSheet(idx);

    updatedSheet[property] = value;

    const updated = Array.from(sheets);
    updated[idx] = updatedSheet;

    setSheets(updated);
  };


  const isValid = () => {
    return !!inputFile;
  };

  const handleInputFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setInputFile(file);
    setChosenFileText(file.name);
    setRawSheets(await getSheets(file));
  };

  const handleInputFileClick = (event) => {
    const realInput = document.getElementById('inputFile');
    realInput.click();
  };

  const handleSubmit = () => onClose({
    inputFile,
    sheets
  });

  const handleDrop = (files = []) => {
    if (!files.length) {
      return;
    }

    handleInputFileChange({
      target: { files }
    });
  };

  return <Modal onClose={ onClose }>
    <Dropzone onDrop={ handleDrop }>
      <Title>
        Import Excel Sheet (.xlsx)
      </Title>

      <Body>
        <form id="import-form" className="import-form" onSubmit={ handleSubmit }>
          <fieldset>
            <div className="fields">
              <div className="form-group">
                <div className="file-input">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={ handleInputFileClick }>Select .xlsx file</button>
                  <p>{chosenFileText}</p>
                </div>

                <input
                  type="file"
                  id="inputFile"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="form-control"
                  name="inputFile"
                  onChange={ handleInputFileChange }
                />
              </div>

            </div>

          </fieldset>

          {
            rawSheets.map(function(rawSheet, idx) {
              return (
                <fieldset>

                  <legend>Decision Table Details - { rawSheet.name } </legend>

                  <div className="fields">

                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        id={ 'tableName-' + idx }
                        className="form-control"
                        name={ 'tableName-' + idx }
                        placeholder="The file name is defaults to the excel sheet name."
                        value={ getSheet(idx, 'tableName') }
                        onChange={ event => updateSheet(idx, 'tableName', event.target.value) } />
                    </div>

                    <div className="form-group">
                      <label>Amount output columns</label>
                      <input
                        type="number"
                        id={ 'amountOutputs-' + idx }
                        className="form-control"
                        name={ 'amountOutputs-' + idx }
                        value={ getSheet(idx, 'amountOutputs') }
                        onChange={ event => updateSheet(idx, 'amountOutputs', event.target.value) }
                      />
                    </div>

                    <div className="form-group">
                      <label>Hit Policy</label>
                      <select
                        id={ 'hitPolicy-' + idx }
                        className="form-control"
                        name={ 'hitPolicy-' + idx }
                        value={ getSheet(idx, 'hitPolicy') }
                        onChange={ event => updateSheet(idx, 'hitPolicy', event.target.value) }>
                        <option>Unique</option>
                        <option>First</option>
                        <option>Priority</option>
                        <option>Any</option>
                        <option>Collect</option>
                        <option>Collect (Sum)</option>
                        <option>Collect (Min)</option>
                        <option>Collect (Max)</option>
                        <option>Collect (Count)</option>
                        <option>Rule order</option>
                        <option>Output order</option>
                      </select>
                    </div>

                  </div>
                </fieldset>
              );
            })
          }
        </form>
      </Body>

      <Footer>
        <div className="import-buttons">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={ !isValid() }
            form="import-form">Import</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={ () => onClose() }>Cancel</button>
        </div>
      </Footer>
    </Dropzone>
  </Modal>;
}


// helpers ////////////////////////

const getFileNameWithoutExtension = (file) => {
  return path.basename(file.path, '.xlsx');
};

const getDirectory = (file) => {
  return path.dirname(file.path) + '/';
};

const times = (n, fn) => {
  return [...Array(n)].map(fn);
};
