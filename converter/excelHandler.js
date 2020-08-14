const xlsx = require('node-xlsx');
const description = require('./domain/description')
const entry = require('./domain/entry')
const input = require('./domain/input')
const inputExpression = require('./domain/inputExpression')
const output = require('./domain/output')
const rule = require('./domain/rule')
const dmnContent = require('./domain/dmnContents')

exports.getDmnContent = ({buffer, tableName, amountOutputs = 1, hitPolicy = "UNQIUE", aggregation}) => {
    const excelSheet = xlsx.parse(buffer, { type: 'buffer'});
    const header = excelSheet[0].data[0];
    const rawInputData = header.slice(0, header.length - amountOutputs);
    const rawOutputData = header.slice(header.length - amountOutputs);
    const safeRuleRows = validateRows(excelSheet[0].data.slice(1));
    const typeRefs = getTypeRefs(safeRuleRows[0]);

    if(!tableName){
        tableName = excelSheet[0].name;
    }
    
    return dmnContent.dmnContents({
        name: tableName,
        hitPolicy: hitPolicy,
        aggregation: aggregation,
        inputs: getInputs(rawInputData, typeRefs),
        outputs: getOutputs(rawOutputData, typeRefs),
        rules: getRules(safeRuleRows, amountOutputs, header.length)
       });
}

const getInputs = (inputArray, typeRefs) => {
    return inputArray.map((text, index) => {
        const expression = inputExpression.inputExpression(`InputExpression${index}`, text, typeRefs[index])
        return input.input(`Input${index}`, text, expression);
    });
}

const getOutputs = (outputArray, typeRefs, amountOutputs) => {
    return outputArray.map((text, index) => output.output(`Output${index}`, text, text, typeRefs[typeRefs.length - outputArray.length + index]));
}

const getRules = (rows, amountOutputs, headerLength) => {
    return rows.map((row, index) => {
        const ruleData = { id: `Rule${index}`,
                            description: row[row.length -1],
                            inputEntries: getEntries(row.slice(0, headerLength - amountOutputs), index, "InputEntry"),
                            outputEntries: getEntries(row.slice(headerLength - amountOutputs, headerLength), index, "OutputEntry")
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

const getTypeRefs = (row) => {
    return row.map((text) => {
        if(!text){
            return "string";
        }

        if(!isNaN(text)){
            if(Number.isSafeInteger(text)){
                return "integer";
            } else {
                return "double";
            }
        }

        if(!(text.trim().startsWith('<') || text.trim().startsWith('>')) && (text.includes('<') || text.includes('>') || text.includes('&&') || text.includes('||'))){
            return 'boolean';
        }

        return 'string';
    });
}