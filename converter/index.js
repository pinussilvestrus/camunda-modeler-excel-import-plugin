const excelHandler = require('./excelHandler');
const dmnXmlGenerator = require('./dmnXmlGenerator');

exports.convertXmlToDmn = (options) => {
  const dmnContent = excelHandler.getDmnContent(options);
  return dmnXmlGenerator.buildXmlFromDmnContent(dmnContent);
};