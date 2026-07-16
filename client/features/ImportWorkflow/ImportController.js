import React, { useState } from 'react';
import { EnhancedImporter } from './EnhancedImporter';
import ColumnMappingModal from '../ColumnMapping/ColumnMappingModal';
import MergePreview from '../RuleMerging/MergePreview';
import { parseExcelFile } from './utils';

const ImportController = ({ modeler, file, onComplete }) => {
  const [step, setStep] = useState('mapping');
  const [excelData, setExcelData] = useState(null);
  const [mappings, setMappings] = useState(null);
  const [mergePreview, setMergePreview] = useState(null);
  const [error, setError] = useState(null);

  const importer = new EnhancedImporter(modeler);

  React.useEffect(() => {
    if (file) {
      processExcelFile(file);
    }
  }, [file]);

  const processExcelFile = async (file) => {
    try {
      const data = await parseExcelFile(file);
      setExcelData(data);
      const dmnParameters = await importer.extractDmnParameters();
      openMappingDialog(data, dmnParameters);
    } catch (error) {
      setError({
        type: 'file_processing',
        message: `Failed to process Excel file: ${error.message}`
      });
    }
  };

  const openMappingDialog = (data, parameters) => {
    setStep('mapping');
    return (
      <ColumnMappingModal
        excelData={data}
        dmnParameters={parameters}
        onConfirm={handleMappingComplete}
        onClose={() => onComplete()}
      />
    );
  };

  const handleMappingComplete = async (columnMappings) => {
    setMappings(columnMappings);
    
    try {
      const mergeResult = await importer.mergeRules(
        null,
        excelData,
        columnMappings
      );

      setMergePreview(mergeResult);
      setStep('preview');
    } catch (error) {
      setError({
        type: 'merge',
        message: `Failed to merge rules: ${error.message}`
      });
    }
  };

  const handleMergeConfirm = async () => {
    try {
      const success = await importer.applyMergedRules(
        null,
        mergePreview.mergedRules
      );

      if (success) {
        setStep('complete');
        setTimeout(() => onComplete(), 1500);
      } else {
        throw new Error('Failed to apply merged rules');
      }
    } catch (error) {
      setError({
        type: 'apply',
        message: error.message
      });
    }
  };

  if (error) {
    return (
      <div className="import-error">
        <h3>Error</h3>
        <p>{error.message}</p>
        <button onClick={() => onComplete()}>Close</button>
      </div>
    );
  }

  switch (step) {
    case 'mapping':
      return openMappingDialog(excelData, importer.extractDmnParameters());
    
    case 'preview':
      return (
        <MergePreview
          mergeStats={mergePreview.stats}
          newRules={mergePreview.mergeResults.successful}
          onConfirm={handleMergeConfirm}
          onCancel={() => setStep('mapping')}
        />
      );
    
    case 'complete':
      return (
        <div className="import-success">
          <h3>Import Complete</h3>
          <p>Successfully merged rules into the DMN table.</p>
        </div>
      );
    
    default:
      return null;
  }
};

export default ImportController;