/* eslint-disable no-unused-vars*/
import React, {
  Fragment,
  PureComponent
} from 'camunda-modeler-plugin-helpers/react';

import {
  Fill
} from 'camunda-modeler-plugin-helpers/components';

import ImportModal from './ImportModal';

import OpenIcon from '../resources/file-excel.svg';

import HIT_POLICIES from './helper/hitPolicies';

import {
  convertXlsxToDmn,
  convertDmnToXlsx,
  parseDmn
} from '../converter';

const defaultState = {
  activeTab: {},
  configOpen: false,
  inputFile: '',
  sheets: [],
  tableName: '',

  // @deprecated
  outputDirectory: '/Users/niklas.kiefer/Desktop/',
};

const API_URL = 'http://localhost:3000/';

const ENCODING_UTF8 = 'utf8';

const PLUGIN_EVENT = 'excel-import-plugin:import';

const FILTER_XLSX = {
  name: 'Excel file',
  encoding: ENCODING_UTF8,
  extensions: [ 'xlsx' ]
};


export default class ExcelPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount() {
    const {
      subscribe
    } = this.props;

    subscribe(PLUGIN_EVENT, () => {
      this.openModal();
    });

    subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.setState({ activeTab });
    });
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

  handleExportError(error) {
    const {
      displayNotification,
      log
    } = this.props;

    displayNotification({
      type: 'error',
      title: 'Excel export failed',
      content: 'See the log for further details.',
      duration: 10000
    });

    log({
      category: 'excel-export-error',
      message: error.message
    });
  }

  handleExportSuccess(exportPath, exportedDecisionTables) {
    const {
      displayNotification
    } = this.props;

    displayNotification({
      type: 'success',
      title: 'Export succeeded!',
      content: <ExportSuccess
        exportPath={ exportPath }
        exportedDecisionTables={ exportedDecisionTables } />,
      duration: 10000
    });
  }

  async handleFileImportSuccess(xml, isMulti = false) {
    const {
      triggerAction,
      subscribe
    } = this.props;

    let tab;

    const hook = subscribe('dmn.modeler.created', (event) => {

      const { modeler } = event;

      modeler.once('import.parse.start', 5000, function() {
        return xml;
      });

      // make tab dirty after import finished
      modeler.once('import.done', function() {
        const drdView = modeler._views.find(({ type }) => type === 'drd');

        if (isMulti && drdView) {
          modeler.open(drdView);
        }

        const commandStack = modeler.getActiveViewer().get('commandStack');

        setTimeout(function() {
          commandStack.registerHandler('excel.foo', NoopHandler);
          commandStack.execute('excel.foo');
        }, 300);
      });
    });

    tab = await triggerAction('create-dmn-diagram');

    // cancel subscription after tab is created
    hook.cancel();
  }

  /** @deprecated */
  async convertXlsxFromApi(options) {
    const {
      _getGlobal
    } = this.props;

    const fileSystem = _getGlobal('fileSystem');

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

    const convertedFile = await fileSystem.readFile(createOutputPath(options), {
      encoding: ENCODING_UTF8
    });

    return convertedFile.contents;
  }

  async convertXlsx(options) {
    const {
      buffer,
      sheets
    } = options;

    const xml = convertXlsxToDmn({
      buffer,
      sheets
    });

    return xml;
  }

  async importExcelSheet(options) {
    const {
      _getGlobal
    } = this.props;

    const fileSystem = _getGlobal('fileSystem');

    let {
      inputFile,
      sheets
    } = options;

    try {

      // (0) get correct hit policy (and aggregation)
      sheets = sheets.map(sheet => {
        sheet = {
          ...sheet,
          ...toHitPolicy(sheet.hitPolicy || 'Unique')
        };

        return sheet;
      });

      // (1) get excel sheet contents
      const excelSheet = await fileSystem.readFile(inputFile.path, {
        encoding: false
      });

      const {
        contents
      } = excelSheet;

      const isMulti = await isMultiSheet(contents);

      // (2) convert to DMN 1.3
      // const xml2 = await this.convertXlsxFromApi(options);
      const xml = await this.convertXlsx({
        ...options,
        buffer: contents,
        sheets
      });

      // (3) open and save generated DMN 1.3 file
      return await this.handleFileImportSuccess(xml, isMulti);

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

  openModal() {
    this.setState({ modalOpen: true });
  }

  async getSheets(file) {
    const {
      _getGlobal
    } = this.props;

    const fileSystem = _getGlobal('fileSystem');

    const excelSheet = await fileSystem.readFile(file.path, {
      encoding: false
    });

    const {
      contents
    } = excelSheet;

    const dmnContents = await parseDmn({ buffer: contents });

    return dmnContents;
  }

  async export() {
    const {
      activeTab
    } = this.state;

    const {
      _getGlobal,
      triggerAction
    } = this.props;

    try {

      // (0) save tab contents
      const savedTab = await triggerAction('save-tab', { tab: activeTab });

      const {
        file,
        name
      } = savedTab;

      // (1) ask user were to export the file
      const dialog = _getGlobal('dialog');

      const exportPath = await dialog.showSaveFileDialog({
        file,
        title: `Save ${name} as ...`,
        filters: [
          FILTER_XLSX
        ]
      });

      if (!exportPath) {
        return false;
      }

      // (2) convert DMN 1.3 file to xlsx
      const {
        contents,
        exportedDecisionTables
      } = await convertDmnToXlsx({
        xml: file.contents
      });

      // (3) save file on disk
      const fileSystem = _getGlobal('fileSystem');

      await fileSystem.writeFile(exportPath, {
        ...file,
        contents
      }, {
        ENCODING_UTF8,
        fileType: 'xlsx'
      });

      return this.handleExportSuccess(exportPath, exportedDecisionTables);
    } catch (error) {
      return this.handleExportError(error);
    }

  }

  render() {
    const {
      activeTab,
      inputFile,
      amountOutputs,
      tableName,
      hitPolicy
    } = this.state;

    const initValues = {
      inputFile,
      amountOutputs,
      tableName,
      hitPolicy
    };

    return <Fragment>
      <Fill slot="toolbar" group="1_general">
        <button
          title="Open excel sheet"
          className="excel-icon"
          onClick={ this.openModal.bind(this) }
        >
          <OpenIcon />
        </button>
      </Fill>

      { isDMN(activeTab) && (
        <Fill slot="toolbar" group="4_export">
          <button
            title="Export as excel sheet"
            className="excel-icon"
            onClick={ this.export.bind(this) }
          >
            <OpenIcon />
          </button>
        </Fill>
      )}
      { this.state.modalOpen && (
        <ImportModal
          getSheets={ this.getSheets.bind(this) }
          onClose={ this.handleConfigClosed.bind(this) }
          initValues={ initValues }
        />
      )}
    </Fragment>;
  }
}


// helpers ////////////////

const ExportSuccess = (props) => {
  const {
    exportedDecisionTables,
    exportPath
  } = props;

  return <div>
    <p>{exportedDecisionTables.length + ' Decision Table(s) were exported.'}</p>
    <p>{'Find your exported Excel file at "' + exportPath + '".'}</p>
  </div>;
};

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

const toHitPolicy = (rawValue) => {
  return HIT_POLICIES[rawValue];
};

const NoopHandler = function() {

  this.execute = function(ctx) {

  };

  this.revert = function(ctx) {

  };
};

const isDMN = (tab) => {
  return tab.type === 'dmn';
};

const isMultiSheet = async (contents) => {
  const dmnContents = await parseDmn({ buffer: contents });

  return dmnContents && dmnContents.length > 1;
};
