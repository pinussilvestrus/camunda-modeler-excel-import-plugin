import xlsx from 'node-xlsx';

import entry from './domain/entry';

import input from './domain/input';

import inputExpression from './domain/inputExpression';

import output from './domain/output';

import rule from './domain/rule';

import dmnContents from './domain/dmnContents';

import {
  nextId
} from './util';

// API //////////////////////////////

export const parseDmnContent = ({
  buffer,
  sheets: sheetsOptions = [],
}) => {
  const excelSheet = xlsx.parse(buffer, { type: 'buffer' });

  return excelSheet.map((sheet, idx) => {
    const header = sheet.data[0];

    const sheetOptions = sheetsOptions[idx] || {};
    let {
      aggregation,
      amountOutputs,
      tableName,
      hitPolicy
    } = sheetOptions;

    const rawInputData = header.slice(0, header.length - amountOutputs);
    const rawOutputData = header.slice(header.length - amountOutputs);
    const safeRuleRows = validateRows(sheet.data.slice(1));
    const typeRefs = getTypeRefs(safeRuleRows[0]);

    if (!tableName) {
      tableName = sheet.name;
    }

    return dmnContents({
      name: tableName,
      hitPolicy,
      aggregation,
      inputs: getInputs(rawInputData, typeRefs),
      outputs: getOutputs(rawOutputData, typeRefs),
      rules: getRules(safeRuleRows, amountOutputs, header.length)
    });
  });

};

export const buildXlsx = (decisionTables = []) => {
  const dataSheets = decisionTables.map(decisionTable => {

    return {
      name: decisionTable.name,
      data: [
        [ ...decisionTable.inputs, ...decisionTable.outputs ],
        ...decisionTable.rules
      ]
    };
  });

  return xlsx.build(dataSheets);
};


// helper /////////////////

const getInputs = (inputArray = [], typeRefs) => {
  return inputArray.map((text, index) => {
    const expression = inputExpression(nextId('InputExpression_'), text, typeRefs[index]);
    return input(nextId('Input_'), text, expression);
  });
};

const getOutputs = (outputArray = [], typeRefs, amountOutputs) => {
  return outputArray.map((text, index) => output(nextId('Output_'), text, text, typeRefs[typeRefs.length - outputArray.length + index]));
};

const getRules = (rows = [], amountOutputs, headerLength) => {
  return rows.map((row) => {
    const ruleData = { id: nextId('Rule_'),
      description: row[row.length -1],
      inputEntries: getEntries(row.slice(0, headerLength - amountOutputs), 'InputEntry'),
      outputEntries: getEntries(row.slice(headerLength - amountOutputs, headerLength), 'OutputEntry')
    };
    return rule(ruleData.id, ruleData.description, ruleData.inputEntries, ruleData.outputEntries);
  });
};

const validateRows = (rows = []) => {
  rows.forEach(element => {
    for (var i = 0; i < element.length;i++) {
      if (element[i] == undefined) {
        element[i] = '';
      }
    }
  });
  return rows;
};


const getEntries = (row = [], rowType) => {
  return row.map((text) => entry(nextId(`${rowType}_`), text));
};

const getTypeRefs = (row = []) => {
  return row.map((text) => {
    if (!text) {
      return 'string';
    }

    if (!isNaN(text)) {
      if (Number.isSafeInteger(text)) {
        return 'integer';
      } else {
        return 'double';
      }
    }

    if (!(text.trim().startsWith('<') || text.trim().startsWith('>')) && (text.includes('<') || text.includes('>') || text.includes('&&') || text.includes('||'))) {
      return 'boolean';
    }

    return 'string';
  });
};