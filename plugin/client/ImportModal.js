/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';


// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{ children }</h2>);
const Body = Modal.Body || (({ children }) => <div>{ children }</div>);
const Footer = Modal.Footer || (({ children }) => <div>{ children }</div>);

// we can even use hooks to render into the application
export default function ImportModal({ initValues, onClose }) {

  const onSubmit = () => onClose({ });

  // we can use the built-in styles, e.g. by adding "btn btn-primary" class names
  return <Modal onClose={ onClose }>
    <Title>
      Import Excel Sheet (.xlsx)
    </Title>

    <Body>
      <form id="importForm" onSubmit={ onSubmit }>
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

