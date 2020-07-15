const express = require('express');

const bodyParser = require('body-parser');

const importExcel = require('./shell');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post('/', function(req, res) {

  console.log('[EXCEL-TO-DMN-API]: starting import ...');

  return importExcel(req.body).then(function(result) {
    const code = result.code;
    const output = result.output;

    if (code == 200) {
      console.log('[EXCEL-TO-DMN-API]: import done.');
    } else {
      console.error('[EXCEL-TO-DMN-API]: something went wrong: ' + output);
    }

    res.sendStatus(code);
  });
});

app.listen(3000, function() {
  console.log('[EXCEL-TO-DMN-API]: app listening on port http://localhost:3000 !');
});