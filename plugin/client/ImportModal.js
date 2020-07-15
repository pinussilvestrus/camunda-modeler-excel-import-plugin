/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{ children }</h2>);
const Body = Modal.Body || (({ children }) => <div>{ children }</div>);
const Footer = Modal.Footer || (({ children }) => <div>{ children }</div>);

export default function ImportModal({ initValues, onClose }) {

  const [ inputColumns, setInputColumns ] = useState(initValues.inputColumns);
  const [ outputColumns, setOutputColumns ] = useState(initValues.outputColumns);
  const [ inputFile, setInputFile ] = useState(initValues.inputFile);
  const [ outputFile, setOutputFile ] = useState(initValues.outputFile);


  const onSubmit = () => onClose({ 
    inputColumns,
    outputColumns,
    inputFile,
    outputFile
   });

  // we can use the built-in styles, e.g. by adding "btn btn-primary" class names
  return <Modal onClose={ onClose }>
    <Title>
      Import Excel Sheet (.xlsx)
    </Title>

    <Body>
      <form id="importForm" onSubmit={ onSubmit }>
        <fieldset>
          <div className="fields">
            <div className="form-group">
              <label>Input File Path</label>
              <input
                type="text"
                id="inputFile"
                className="form-control"
                name="inputFile"
                value={inputFile}
                onChange={ event => setInputFile(event.target.value) }
              />
            </div>

            <div className="form-group">
              <label>Input Columns</label>
              <input
                type="text"
                id="inputColumns"
                className="form-control"
                name="inputColumns"
                value={inputColumns}
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
                value={outputColumns}
                onChange={ event => setOutputColumns(event.target.value) }
              />
            </div>

            <div className="form-group">
              <label>Output File Path</label>
              <input
                type="text"
                id="outputFile"
                className="form-control"
                name="outputFile"
                value={outputFile}
                onChange={ event => setOutputFile(event.target.value) }
              />
            </div>
          </div>
        </fieldset>
      </form>
    </Body>

    <Footer>
      <div id="importFormButtons">
        <button type="submit" class="btn btn-primary" form="importForm">Import</button>
        <button type="button" class="btn btn-secondary" onClick={ () => onClose() }>Cancel</button>
      </div>
    </Footer>
  </Modal>;
}

