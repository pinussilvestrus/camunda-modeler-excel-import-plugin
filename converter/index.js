const excelHandler = require('./excelHandler');
const { dmnContents } = require('./domain/dmnContents');
const dmnXmlGenerator = require('./dmnXmlGenerator');

exports.convertXmlToDmn = (options) => {
    const dmnContent  = excelHandler.getDmnContent(options);
    return dmnXmlGenerator.buildXmlFromDmnContent(dmnContent);
};