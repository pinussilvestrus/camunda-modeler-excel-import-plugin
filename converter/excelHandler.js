import xlsx from 'node-xlsx';

import entry from './domain/entry';

import input from './domain/input';

import inputExpression from './domain/inputExpression';

import output from './domain/output';

import rule from './domain/rule';

import dmnContents from './domain/dmnContents';


const getInputs = (inputArray, typeRefs) => {
  return inputArray.map((text, index) => {
    const expression = inputExpression(`InputExpression${index}`, text, typeRefs[index]);
    return input(`Input${index}`, text, expression);
  });
};

const getOutputs = (outputArray, typeRefs, amountOutputs) => {
  return outputArray.map((text, index) => output(`Output${index}`, text, text, typeRefs[typeRefs.length - outputArray.length + index]));
};

const getRules = (rows, amountOutputs, headerLength) => {
  return rows.map((row, index) => {
    const ruleData = { id: `Rule${index}`,
      description: row[row.length -1],
      inputEntries: getEntries(row.slice(0, headerLength - amountOutputs), index, 'InputEntry'),
      outputEntries: getEntries(row.slice(headerLength - amountOutputs, headerLength), index, 'OutputEntry')
    };
    return rule(ruleData.id, ruleData.description, ruleData.inputEntries, ruleData.outputEntries);
  });
};

const validateRows = (rows) => {
  rows.forEach(element => {
    for (var i = 0; i < element.length;i++) {
      if (element[i] == undefined) {
        element[i] = '';
      }
    }
  });
  return rows;
};

const getEntries = (row, ruleIndex, rowType) => {
  return row.map((text, entryIndex) => entry(`${rowType}${ruleIndex}${entryIndex}`, text));
};

const getTypeRefs = (row) => {
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


// API //////////////////////////////

export const parseDmnContent = ({
  buffer,
  tableName,
  amountOutputs = 1,
  hitPolicy = 'UNQIUE',
  aggregation
}) => {
  const excelSheet = xlsx.parse(buffer, { type: 'buffer' });
  const header = excelSheet[0].data[0];
  const rawInputData = header.slice(0, header.length - amountOutputs);
  const rawOutputData = header.slice(header.length - amountOutputs);
  const safeRuleRows = validateRows(excelSheet[0].data.slice(1));
  const typeRefs = getTypeRefs(safeRuleRows[0]);

  if (!tableName) {
    tableName = excelSheet[0].name;
  }

  return dmnContents({
    name: tableName,
    hitPolicy: hitPolicy,
    aggregation: aggregation,
    inputs: getInputs(rawInputData, typeRefs),
    outputs: getOutputs(rawOutputData, typeRefs),
    rules: getRules(safeRuleRows, amountOutputs, header.length)
  });
};

export const buildXlsx = (decisionTables) => {
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