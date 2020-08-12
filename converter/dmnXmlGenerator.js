const builder = require('xmlbuilder');
const { inputExpression } = require('./domain/inputExpression');

const xmlns = "https://www.omg.org/spec/DMN/20191111/MODEL/";
const xmlnsDmndi = "https://www.omg.org/spec/DMN/20191111/DMNDI/";
const xmlnsDc = "http://www.omg.org/spec/DMN/20180521/DC/";
const id = "AutoGeneratedDmn";
const name = "DRD";
const namespace = "http://camunda.org/schema/1.0/dmn";



const generateBaseNodes = (decisionName, hitPolicy = "UNIQUE") => {
  let xml = builder.create({'definitions': {'@xmlns': xmlns, '@xmlns:dmndi': xmlnsDmndi, '@xmlns:dc': xmlnsDc, '@id': id, '@name':name, '@namespace': namespace}})
    .ele({decision: {"@id": "AutoGeneratedDecision", "@name": decisionName}})
    
return xml;
}


const generateRuleNodes = (rules) => {
    
   return rules.map(rule => {

        const inputEntries = rule.inputEntries.map(entry => {
            return {'@id': entry.id,
                    'text': entry.text
                }
        });

        const outputEntries = rule.outputEntries.map(entry => {
            return {
                    '@id': entry.id,
                    'text': entry.text 
                }
        });

        return {
                '@id': rule.id,
                description: rule.description,
                inputEntry: inputEntries,
                outputEntry: outputEntries
            }
    });
}

const generateInputNodes = (inputs) => {
    return inputs.map(input => {
        
        return {
            '@id': input.id,
            '@label': input.label,
            inputExpression: {
                '@id': input.inputExpression.id,
                '@typeRef': input.inputExpression.typeRef,
                text: input.inputExpression.text
            }
        }
    });    
}

const generateOutputNodes = (outputs) => {
    return outputs.map(output => {
        return {
            '@id': output.id,
            '@label': output.text,
            '@name': output.name,
            '@typeRef': output.typeRef
        }
    });    
}



exports.buildXmlFromDmnContent = (dmnContents) => {
    var builder = generateBaseNodes();
    const ruleNodes = generateRuleNodes(dmnContents.rules);
    const inputNodes = generateInputNodes(dmnContents.inputs);
    const outputNodes = generateOutputNodes(dmnContents.outputs);
    builder = builder.ele({'decisionTable' : {'@id': 'AutoGeneratedDecTable',input: inputNodes, output: outputNodes, rule: ruleNodes}})

    return builder.end({ pretty: true});
}