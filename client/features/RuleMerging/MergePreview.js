import React from 'react';

const MergePreview = ({ mergeStats, newRules, onConfirm, onCancel }) => {
  return (
    <div className="merge-preview">
      <div className="merge-preview-header">
        <h3>Rule Merge Preview</h3>
      </div>
      
      <div className="merge-stats">
        <div className="stat-item">
          <label>Original Rules:</label>
          <span>{mergeStats.originalRules}</span>
        </div>
        <div className="stat-item">
          <label>New Rules:</label>
          <span>{mergeStats.addedRules}</span>
        </div>
        <div className="stat-item">
          <label>Total After Merge:</label>
          <span>{mergeStats.totalRules}</span>
        </div>
      </div>

      <div className="preview-table">
        <h4>New Rules to be Added</h4>
        <table>
          <thead>
            <tr>
              {Object.keys(newRules[0] || {}).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {newRules.map((rule, index) => (
              <tr key={index}>
                {Object.values(rule).map((value, valueIndex) => (
                  <td key={valueIndex}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="merge-preview-footer">
        <button onClick={onCancel} className="btn-secondary">Back to Mapping</button>
        <button onClick={onConfirm} className="btn-primary">Confirm Merge</button>
      </div>
    </div>
  );
};

export default MergePreview;