/* eslint-disable no-unused-vars*/
import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import ImportModal from './ImportModal';

const defaultState = {
  enabled: false,
  interval: 5,
  configOpen: false
};

export default class ExcelPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleConfigClosed = this.handleConfigClosed.bind(this);
  }

  handleConfigClosed() {
    const {
      log
    } = this.props;

    this.setState({ modalOpen: false });

    log('triggered...')
  }

  render() {

    // we can use fills to hook React components into certain places of the UI
    return <Fragment>
      <Fill slot="toolbar" group="9_excel">
        <button type="button" onClick={ () => this.setState({ modalOpen: true }) }>
          Import Excel
        </button>
      </Fill>
      { this.state.modalOpen && (
        <ImportModal
          onClose={ this.handleConfigClosed }
          initValues={ {} }
        />
      )}
    </Fragment>;
  }
}
