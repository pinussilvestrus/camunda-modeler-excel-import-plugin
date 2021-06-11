import {
  parseDmnContent,
  buildXlsx
} from './excelHandler';

import {
  buildXmlFromDmnContent
} from './dmnXmlGenerator';

import {
  buildJsonFromXML
} from './dmnJsonGenerator';

export const parseDmn = (options) => {
  return parseDmnContent(options);
};

export const convertXlsxToDmn = (options) => {
  const dmnContent = parseDmnContent(options);

  return buildXmlFromDmnContent(dmnContent);
};

export const convertDmnToXlsx = async (options) => {
  const dmnContent = await buildJsonFromXML(options);
  const xlsx = buildXlsx(dmnContent);

  return {
    contents: xlsx,
    exportedDecisionTables: dmnContent
  };
};