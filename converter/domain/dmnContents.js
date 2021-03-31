export default (rawContent) => {
  return {
    name: rawContent.name,
    hitPolicy: rawContent.hitPolicy,
    aggregation: rawContent.aggregation,
    inputs: rawContent.inputs,
    outputs: rawContent.outputs,
    rules: rawContent.rules
  };
};