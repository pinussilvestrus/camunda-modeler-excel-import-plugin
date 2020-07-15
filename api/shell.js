const shell = require('shelljs');

const DEFAULT_BIN_PATH = 'bin/dmn-xlsx-cli-0.4.0-SNAPSHOT.jar';
const DEFAULT_INPUTS = 'A,B';
const DEFAULT_OUTPUTS = 'C';
const DEFAULT_INPUT_FILE = '~/pet-projects/excel-to-dmn-plugin/example.xlsx';
const DEFAULT_OUTPUT_FILE = 'file.dmn';

const importExcel = function(options = {}) {

  const binPath = options.binPath || DEFAULT_BIN_PATH;
  const inputs = options.inputs || DEFAULT_INPUTS;
  const outputs = options.outputs || DEFAULT_OUTPUTS;
  const inputFile = options.inputFile || DEFAULT_INPUT_FILE;
  const outputFile = options.outputFile || DEFAULT_OUTPUT_FILE;

  const command = `java -jar ${binPath} --inputs ${inputs} --outputs ${outputs} ${inputFile} ${outputFile}`;

  // TODO(pinussilvestrus): test purposes only cleanup
  shell.rm([ outputFile ]);

  return new Promise(function(resolve) {
    shell.exec(command, function(code, output) {
      resolve({ code: code === 0 ? 200 : 500, output: output });
    });
  });
};

module.exports = importExcel;