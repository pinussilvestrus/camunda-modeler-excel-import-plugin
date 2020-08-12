/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{ children }</h2>);
const Body = Modal.Body || (({ children }) => <div>{ children }</div>);
const Footer = Modal.Footer || (({ children }) => <div>{ children }</div>);

const path = require('path');

export default function ImportModal({ initValues, onClose }) {

  const [ inputColumns, setInputColumns ] = useState(initValues.inputColumns);
  const [ outputColumns, setOutputColumns ] = useState(initValues.outputColumns);
  const [ inputFile, setInputFile ] = useState(initValues.inputFile);
  const [ outputDirectory, setOutputDirectory ] = useState(initValues.outputDirectory);
  const [ tableName, setTableName ] = useState(initValues.tableName);
  const [ hitPolicy, setHitPolicy ] = useState(initValues.hitPolicy);

  const [ chosenDirectoryText, setChosenDirectoryText ] = useState('No directory selected.');
  const [ chosenFileText, setChosenFileText ] = useState('No file selected.');

  const handleInputFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setTableName(getFileNameWithoutExtension(file));
    setInputFile(file);
    setChosenFileText(file.name);
  };

  const handleOutputDirectoryChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const directory = getDirectory(file);
    setOutputDirectory(directory);
    setChosenDirectoryText(directory);
  };

  const handleInputFileClick = (event) => {
    const realInput = document.getElementById('inputFile');
    realInput.click();
  };

  const handleDirectoryClick = (event) => {
    const realInput = document.getElementById('outputDirectory');
    realInput.click();
  };

  const handleSubmit = () => onClose({
    inputColumns,
    outputColumns,
    inputFile,
    outputDirectory,
    tableName,
    hitPolicy
  });

  return <Modal onClose={ onClose }>
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

            { false &&
              <div className="form-group">
                <div className="file-input">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={ handleDirectoryClick }>Select output directory</button>
                  <p>{chosenDirectoryText}</p>
                </div>

                <input
                  type="file"
                  directory="true"
                  allowdirs="true"
                  webkitdirectory="true"
                  id="outputDirectory"
                  className="form-control"
                  name="outputDirectory"
                  onChange={ handleOutputDirectoryChange }
                />
              </div>
            }
          </div>

        </fieldset>

        <fieldset>

          <legend>Decision Table Details</legend>

          <div className="fields">

            <div className="form-group">
              <label>Decision Table Name</label>
              <input
                type="text"
                id="tableName"
                className="form-control"
                name="tableName"
                value={ tableName }
                onChange={ event => setTableName(event.target.value) } />
            </div>

            <div className="form-group">
              <label>Input Columns</label>
              <input
                type="text"
                id="inputColumns"
                className="form-control"
                name="inputColumns"
                value={ inputColumns }
                onChange={ event => setInputColumns(event.target.value) }
              />
            </div>

            <div className="form-group">
              <label>Output Columns</label>
              <input
                type="text"
                id="outputColumns"
                className="form-control"
                name="outputColumns"
                value={ outputColumns }
                onChange={ event => setOutputColumns(event.target.value) }
              />
            </div>

            <div className="form-group">
              <label>Hit Policy</label>
              <select
                id="hitPolicy"
                className="form-control"
                name="hitPolicy"
                value={ hitPolicy }
                onChange={ event => setHitPolicy(event.target.value) }>
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
      </form>
    </Body>

    <Footer>
      <div className="import-buttons">
        <button type="submit" className="btn btn-primary" form="import-form">Import</button>
        <button type="button" className="btn btn-secondary" onClick={ () => onClose() }>Cancel</button>
      </div>
    </Footer>
  </Modal>;
}


// helpers ////////////////////////

const getFileNameWithoutExtension = (file) => {
  return path.basename(file.path, '.xlsx');
};

const getDirectory = (file) => {
  return path.dirname(file.path) + '/';
};
