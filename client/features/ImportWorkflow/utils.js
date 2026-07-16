import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          dateNF: 'yyyy-mm-dd'
        });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });

        if (!jsonData || jsonData.length === 0) {
          reject(new Error('No data found in Excel file'));
          return;
        }

        resolve(jsonData);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const validateExcelStructure = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Excel file must contain at least one row of data');
  }

  const headers = Object.keys(data[0]);
  if (headers.length === 0) {
    throw new Error('Excel file must contain at least one column');
  }

  return {
    rowCount: data.length,
    headers,
    firstRow: data[0]
  };
};

export const formatColumnName = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

export const generateMappingSuggestions = (excelHeaders, dmnParameters) => {
  const suggestions = {};
  
  dmnParameters.forEach(param => {
    const normalizedParamName = formatColumnName(param.name);
    
    const matchingHeader = excelHeaders.find(header => {
      const normalizedHeader = formatColumnName(header);
      return normalizedHeader === normalizedParamName ||
             normalizedHeader.includes(normalizedParamName) ||
             normalizedParamName.includes(normalizedHeader);
    });
    
    if (matchingHeader) {
      suggestions[param.id] = matchingHeader;
    }
  });
  
  return suggestions;
};