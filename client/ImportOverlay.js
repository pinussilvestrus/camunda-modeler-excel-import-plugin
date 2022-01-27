/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'camunda-modeler-plugin-helpers/react';
import { Overlay, Section } from 'camunda-modeler-plugin-helpers/components';

const path = require('path');

const OVERLAY_OFFSET = { top: 0, right: 0 };


export default function ImportOverlay(props) {
  const {
    anchor,
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

  return <Overlay offset={ OVERLAY_OFFSET } anchor={ anchor } onClose={ onClose }>
    <Section>
      <Section.Header>
        Import Excel Sheet
      </Section.Header>
      <Section.Body>
        <form id="select-file" className="import-form">
          <fieldset>
            <div className="fields">
              <div className="form-group">
                <div className="file-input">
                  <button
                    type="button"
                    className="btn btn-primary"
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
        </form>
      </Section.Body>
    </Section>

    { rawSheets.length ? (
      <React.Fragment>
        <Section maxHeight="400px">
          <Section.Body>
            <form id="import-form" className="import-form" onSubmit={ handleSubmit }>
              {
                rawSheets.map(function(rawSheet, idx) {
                  return (
                    <Section key={ idx }>

                      <Section.Header>
                        Decision Table Details - { rawSheet.name }
                      </Section.Header>

                      <Section.Body>
                        <fieldset>
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
                      </Section.Body>
                    </Section>
                  );
                })
              }
            </form>
          </Section.Body>
        </Section>
        <Section>
          <Section.Body>
            <Section.Actions>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={ !isValid() }
                form="import-form">Import</button>
            </Section.Actions>
          </Section.Body>
        </Section>
      </React.Fragment>
    ) : null }
  </Overlay>;
}


// helpers ////////////////////////

const getFileNameWithoutExtension = (file) => {
  return path.basename(file.path, '.xlsx');
};

const getDirectory = (file) => {
  return path.dirname(file.path) + '/';
};

const times = (n, fn) => {
  return [ ...Array(n) ].map(fn);
};
