import React, { useState, useEffect } from 'react';

const ColumnMappingModal = ({ onClose, onConfirm, excelData, dmnParameters }) => {
  const [mappings, setMappings] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const initialMappings = {};
    dmnParameters.forEach(param => {
      initialMappings[param.id] = {
        excelColumn: null,
        dataType: param.type
      };
    });
    setMappings(initialMappings);
  }, [dmnParameters]);

  const handleColumnSelect = (parameterId, columnName) => {
    setMappings(prev => ({
      ...prev,
      [parameterId]: {
        ...prev[parameterId],
        excelColumn: columnName
      }
    }));
  };

  const validateMapping = () => {
    const errors = {};
    Object.entries(mappings).forEach(([parameterId, mapping]) => {
      if (!mapping.excelColumn) {
        errors[parameterId] = 'Column mapping is required';
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = () => {
    if (validateMapping()) {
      onConfirm(mappings);
    }
  };

  return (
    <div className="column-mapping-modal">
      <div className="modal-header">
        <h2>Map Excel Columns to DMN Parameters</h2>
      </div>
      <div className="modal-content">
        {dmnParameters.map(param => (
          <div key={param.id} className="mapping-row">
            <label>{param.name}</label>
            <select
              value={mappings[param.id]?.excelColumn || ''}
              onChange={(e) => handleColumnSelect(param.id, e.target.value)}
            >
              <option value="">Select Column</option>
              {excelData.columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
            {validationErrors[param.id] && (
              <span className="error">{validationErrors[param.id]}</span>
            )}
          </div>
        ))}
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={handleConfirm} className="btn-primary">Confirm Mapping</button>
      </div>
    </div>
  );
};

export default ColumnMappingModal;