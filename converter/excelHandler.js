const xlsx = require('node-xlsx');
const description = require('./domain/description')
const entry = require('./domain/entry')
const input = require('./domain/input')
const inputExpression = require('./domain/inputExpression')
const output = require('./domain/output')
const rule = require('./domain/rule')
const dmnContent = require('./domain/dmnContents')

exports.getDmnContent = (buffer, amountOutputs = 1) => {
    const excelSheet = xlsx.parse(buffer);
    const header = excelSheet.data[0];
    const rawInputData = excelSheet.data[0].slice(0, header.length - amountOutputs);
    const rawOutputData = excelSheet.data[0].slice(header.length - amountOutputs);
    const safeRuleRows = validateRows(excelSheet.data.slice(1));
    
    return dmnContent.dmnContents({
        name: excelSheet.name,
        hitPolicy: "UNIQUE",
        inputs: getInputs(rawInputData),
        outputs: getOutputs(rawOutputData),
        rules: getRules(safeRuleRows, amountOutputs)
       });
}

const getInputs = (inputArray) => {
    return inputArray.map((text, index) => {
        const expression = inputExpression.inputExpression(`InputExpression${index}`, text)
        return input.input(`Input${index}`, text, expression);
    });
}

const getOutputs = (outputArray) => {
    return outputArray.map((text, index) => output.output(`Output${index}`, text, text));
}

const getRules = (rows, amountOutputs) => {
    return rows.map((row, index) => {
        const ruleData = { id: `Rule${index}`,
                            description: row[row.length -1],
                            inputEntries: getEntries(row.slice(0, row.length - amountOutputs), index, "InputEntry"),
                            outputEntries: getEntries(row.slice(row.length - amountOutputs), index, "OutputEntry")
                        }
                        
        return rule.rule(ruleData.id, ruleData.description, ruleData.inputEntries, ruleData.outputEntries);
    });
}

const validateRows = (rows) => {
    rows.forEach(element => {
        for(var i = 0; i < element.length;i++){
            if(element[i] == undefined){
                element[i] = "";
            }
        }
    });
    return rows;
}

const getEntries = (row, ruleIndex, rowType) => {
    return row.map((text, entryIndex) => entry.entry(`${rowType}${ruleIndex}${entryIndex}`, text));
} 