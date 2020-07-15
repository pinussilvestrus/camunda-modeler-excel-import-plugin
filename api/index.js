const express = require('express');

const importExcel = require('./shell');

const app = express();

app.post('/', function(req, res) {

  console.log('EXCEL-TO-DMN-API: Starting import ...');

  return importExcel().then(function(result) {
    const code = result.code;
    const output = result.output;

    if (code == 200) {
      console.log('EXCEL-TO-DMN-API: Import done.');
    } else {
      console.error('EXCEL-TO-DMN-API: Something went wrong: ' + output);
    }

    res.sendStatus(code);
  });
});

app.listen(3000, function() {
  console.log('Example app listening on port http://localhost:3000 !');
});