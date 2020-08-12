/* eslint-disable no-unused-vars*/
import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import ImportModal from './ImportModal';

import Icon from '../resources/file-excel.svg';

import HIT_POLICIES from './helper/hitPolicies';

const defaultState = {
  configOpen: false,
  inputColumns: 'A,B',
  outputColumns: 'C',
  inputFile: '',
  outputDirectory: '/Users/niklas.kiefer/Desktop/',
  hitPolicy: 'Unique',
  tableName: 'default'
};

const API_URL = 'http://localhost:3000/';

const ENCODING_UTF8 = 'utf8';

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

  async handleFileImportSuccess(xml) {
    const {
      triggerAction
    } = this.props;

    return await triggerAction('create-dmn-diagram', {
      contents: xml
    });
  }

  /** @deprecated */
  async convertXlsxFromApi(options) {
    const {
      fileSystem
    } = this.props;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: createImportRequestBody(options)
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const convertedFile = await fileSystem.readFile(createOutputPath(options));

    return convertedFile.contents;
  }

  // todo(pinussilvestrus): implement me
  async convertXlsx(options) {
    return '';
  }

  async importExcelSheet(options) {

    const {
      fileSystem
    } = this.props;

    const {
      inputFile,
      hitPolicy
    } = options;

    try {

      // (0) get correct hit policy (and aggregation)
      const hitPolicyDetails = toHitPolicy(hitPolicy);

      options = {
        ...options,
        ...hitPolicyDetails
      };

      // (1) get excel sheet contents
      const excelSheet = await fileSystem.readFile(inputFile.path, {
        encoding: ENCODING_UTF8
      });

      const {
        contents
      } = excelSheet;

      const buffer = toBuffer(contents);

      // (2) convert to DMN 1.3

      // todo(pinussilvestrus): use new node module
      // const xml = await this.convertXlsx(options);

      const xml = await this.convertXlsxFromApi(options);

      return await this.handleFileImportSuccess(xml);

    } catch (error) {
      this.handleImportError(error);
    }
  }

  handleConfigClosed(importDetails) {
    this.setState({ modalOpen: false });

    if (!importDetails) {
      return;
    }

    this.importExcelSheet(importDetails);
  }

  render() {
    const {
      inputFile,
      outputDirectory,
      inputColumns,
      outputColumns,
      tableName,
      hitPolicy
    } = this.state;

    const initValues = {
      inputColumns,
      outputColumns,
      inputFile,
      outputDirectory,
      tableName,
      hitPolicy
    };

    return <Fragment>
      <Fill slot="toolbar" group="1_general">
        <button
          title="Open excel sheet"
          className="excel-icon"
          onClick={ () => this.setState({ modalOpen: true }) }
        >
          <Icon />
        </button>
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


// helpers ////////////////

const createImportRequestBody = (details) => {
  return JSON.stringify({
    inputColumns: details.inputColumns,
    outputColumns: details.outputColumns,
    inputFile: details.inputFile.path,
    outputFile: createOutputPath(details)
  });
};

const createOutputPath = (details) => {
  return details.outputDirectory + details.tableName + '.dmn';
};

const toBuffer = (contents) => {
  return Buffer.from(contents, ENCODING_UTF8);
};

const toHitPolicy = (rawValue) => {
  return HIT_POLICIES[rawValue];
};