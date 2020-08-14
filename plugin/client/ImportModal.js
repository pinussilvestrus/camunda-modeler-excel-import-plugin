/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{ children }</h2>);
const Body = Modal.Body || (({ children }) => <div>{ children }</div>);
const Footer = Modal.Footer || (({ children }) => <div>{ children }</div>);

const path = require('path');

export default function ImportModal({ initValues, onClose }) {

  const [ inputFile, setInputFile ] = useState(initValues.inputFile);

  const [ amountOutputs, setAmountOutputs ] = useState(initValues.amountOutputs);
  const [ tableName, setTableName ] = useState(initValues.tableName);
  const [ hitPolicy, setHitPolicy ] = useState(initValues.hitPolicy);

  const [ chosenFileText, setChosenFileText ] = useState('No file selected.');

  const isValid = () => {
    return !!amountOutputs &&
      !!inputFile &&
      !!tableName &&
      !!hitPolicy;
  };

  const handleInputFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setTableName(getFileNameWithoutExtension(file));
    setInputFile(file);
    setChosenFileText(file.name);
  };

  const handleInputFileClick = (event) => {
    const realInput = document.getElementById('inputFile');
    realInput.click();
  };

  const handleSubmit = () => onClose({
    amountOutputs,
    inputFile,
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

          </div>

        </fieldset>

        <fieldset>

          <legend>Decision Table Details</legend>

          <div className="fields">

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                id="tableName"
                className="form-control"
                name="tableName"
                placeholder="The file name defaults to the excel sheet name."
                value={ tableName }
                onChange={ event => setTableName(event.target.value) } />
            </div>

            <div className="form-group">
              <label>Amount output columns</label>
              <input
                type="number"
                id="amountOutputs"
                className="form-control"
                name="amountOutputs"
                value={ amountOutputs }
                onChange={ event => setAmountOutputs(event.target.value) }
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
  </Modal>;
}


// helpers ////////////////////////

const getFileNameWithoutExtension = (file) => {
  return path.basename(file.path, '.xlsx');
};

const getDirectory = (file) => {
  return path.dirname(file.path) + '/';
};
