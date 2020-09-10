import React from 'camunda-modeler-plugin-helpers/react';

export default class DropZone extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      draggingOver: false
    };
  }

  handleDragOver(event) {
    if (!this.isDragAllowed(event)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

    if (this.state.draggingOver) {
      return;
    }

    event.stopPropagation();

    this.setState({ draggingOver: true });
  }

  /**
   * @param {DragEvent} event
   */
  isDragAllowed(event) {
    const { dataTransfer } = event;

    const { items } = dataTransfer;

    if (items.length != 1) {
      return false;
    }

    return isDropableItem(items[0]);
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.state.draggingOver && !event.relatedTarget) {
      this.setState({ draggingOver: false });
    }
  }

  handleDrop(event) {
    if (!this.state.draggingOver) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.setState({ draggingOver: false });

    this.props.onDrop(event.dataTransfer.files);
  }

  render() {
    return (
      <div
        className="plugin-dropzone"
        onDragOver={ this.handleDragOver.bind(this) }
        onDragLeave={ this.handleDragLeave.bind(this) }
        onDrop={ this.handleDrop.bind(this) }
      >
        { this.state.draggingOver ? <DropOverlay /> : null }
        { this.props.children }
      </div>
    );
  }
}

DropZone.defaultProps = {
  onDrop: () => {}
};

function DropOverlay() {
  return (
    <div className="plugin-dropzone-overlay">
      <div className="box">
        <div>Drop Excel sheet here</div>
      </div>
    </div>
  );
}


// helpers /////////////////////

/**
 * Checks for droppable items, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.
 *
 * @param {Object} item - Item to be dropped.
 *
 * @returns {boolean}
 */
function isDropableItem(item) {
  const { kind, type } = item;

  if (kind !== 'file') {
    return false;
  }

  return type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}