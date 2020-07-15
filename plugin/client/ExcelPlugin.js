/* eslint-disable no-unused-vars*/
import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import ImportModal from './ImportModal';

import Icon from '../resources/file-excel.svg';

const defaultState = {
  configOpen: false,
  inputColumns: 'A,B',
  outputColumns: 'C',
  inputFile: '~/pet-projects/excel-to-dmn-plugin/example.xlsx',
  outputFile: '~/Desktop/file.dmn'
};

const API_URL = "http://localhost:3000/";

export default class ExcelPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleConfigClosed = this.handleConfigClosed.bind(this);
  }

  handleImportError(error) {
    const {
      displayNotification,
      log
    } = this.props;

    displayNotification({
      type: 'error',
      title: 'Excel import failed',
      content: 'See the log for further details.',
      duration: 10000
    });

    log({
      category: 'excel-import-error',
      message: error.message
    });
  }

  async importExcelSheet(importDetails) {
    const {
      triggerAction
    } = this.props;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importDetails)
      });
      
      if(response.ok) {
        await triggerAction('open-diagram');
      }

    } catch(error) {
      this.handleImportError(error);
    }
  }

  handleConfigClosed(importDetails) {
    this.setState({ modalOpen: false });

    if(!importDetails) {
      return;
    }

    this.importExcelSheet(importDetails);
  }

  render() {
    const {
      inputFile,
      outputFile,
      inputColumns,
      outputColumns
    } = this.state;

    const initValues = {
      inputColumns,
      outputColumns,
      inputFile,
      outputFile
    };

    return <Fragment>
      <Fill slot="toolbar" group="9_excel">
        <Icon className="excel-icon" onClick={ () => this.setState({ modalOpen: true }) } />
      </Fill>
      { this.state.modalOpen && (
        <ImportModal
          onClose={ this.handleConfigClosed }
          initValues={ initValues }
        />
      )}
    </Fragment>;
  }
}
