import Moddle from 'dmn-moddle';

const dmnModdle = new Moddle();

export const buildJsonFromXML = async ({ xml }) => {

  const { rootElement: definitions } = await dmnModdle.fromXML(xml);

  const decisionTables = getAllDecisionTables(definitions);

  return decisionTables.map(d => {
    const decisionLogic = d.get('decisionLogic');

    return {
      id: d.id,
      inputs: decisionLogic.get('input').map(buildParseableInput),
      outputs: decisionLogic.get('output').map(buildParseableOutput),
      rules: decisionLogic.get('rule').map(buildParseableRule),
      name: d.get('name')
    };
  });
};


// helpers ////////////////////

const getAllDecisionTables = (definitions) => {
  const drgElement = definitions.get('drgElement');

  if (!drgElement || !drgElement.length) {
    return [];
  }

  const decisions = drgElement.filter((d) => d.$type === 'dmn:Decision');

  return decisions.filter((dt) => dt.get('decisionLogic').$type === 'dmn:DecisionTable');
};

const buildParseableInput = (input) => {
  const expression = input.get('inputExpression');

  if (expression && expression.get('text')) {
    return expression.get('text');
  }

  return input.get('label');
};

const buildParseableOutput = (output) => {
  return output.get('name') || output.get('label');
};

const buildParseableRule = (rule) => {
  const inputEntries = rule.get('inputEntry');

  const outputEntries = rule.get('outputEntry');

  const annotation = rule.get('description');

  let parseableRule = [];

  if (inputEntries && inputEntries.length) {
    inputEntries.forEach(i => parseableRule.push(i.get('text')));
  }

  if (outputEntries && outputEntries.length) {
    outputEntries.forEach(o => parseableRule.push(o.get('text')));
  }

  if (annotation) {
    parseableRule.push(annotation);
  }

  return parseableRule;
};