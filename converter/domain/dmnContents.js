exports.dmnContents = (rawContent) => {
    return {
        name: rawContent.name,
        hitPolicy: rawContent.hitPolicy,
        inputs: rawContent.inputs,
        outputs: rawContent.outputs,
        rules: rawContent.rules
    }
}