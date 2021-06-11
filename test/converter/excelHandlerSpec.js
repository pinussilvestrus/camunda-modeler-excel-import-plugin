const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

const parseDmnContent = require('../../converter/excelHandler').parseDmnContent,
      buildXlsx = require('../../converter/excelHandler').buildXlsx;

const buffer = fs.readFileSync(__dirname + '/../fixtures/example.xlsx');
const bufferMultiple = fs.readFileSync(__dirname + '/../fixtures/example-multiple.xlsx');


describe('excelHandler', () => {

  describe('#getDmnContent', () => {

    it('should return processed dmn content as json', () => {

      // given
      const options = createOptions();

      // when
      const dmnContents = parseDmnContent(options);

      // then
      expect(dmnContents).to.have.length(1);

      const dmnContent = dmnContents[0];

      expect(dmnContent.name).to.be.a('string');
      expect(dmnContent.name).to.equal(options.sheets[0].tableName);
      expect(dmnContent.hitPolicy).to.be.a('string');
      expect(dmnContent.hitPolicy).to.equal(options.sheets[0].hitPolicy);
      expect(dmnContent.inputs).to.have.length(standardExpectedInputs().length);
      expect(dmnContent.outputs).to.have.length(standardExpectedOutput().length);
      expect(dmnContent.rules).to.have.length(standardExpectedRules().length);
    });


    it('should return processed dmn content as json - multiple', () => {

      // given
      const sheets = [
        {
          tableName: 'foo',
          amountOutputs: 1,
          hitPolicy: 'UNIQUE',
          aggregation: undefined,
        },
        {
          tableName: 'bar',
          amountOutputs: 2,
          hitPolicy: 'UNIQUE',
          aggregation: undefined,
        }
      ];

      const options = createOptions({
        buffer: bufferMultiple,
        sheets
      });

      // when
      const dmnContents = parseDmnContent(options);

      // then
      expect(dmnContents).to.have.length(2);
    });


    it('should return processed dmn content as json with hit policy COLLECT SUM', () => {

      // given
      const options = createOptions({
        sheet: {
          hitPolicy: 'COLLECT',
          aggregation: 'SUM'
        }
      });

      // when
      const dmnContents = parseDmnContent(options);

      // then
      expect(dmnContents).to.have.length(1);

      const dmnContent = dmnContents[0];

      expect(dmnContent.name).to.be.a('string');
      expect(dmnContent.name).to.equal(options.sheets[0].tableName);
      expect(dmnContent.hitPolicy).to.be.a('string');
      expect(dmnContent.hitPolicy).to.equal(options.sheets[0].hitPolicy);
      expect(dmnContent.aggregation).to.be.a('string');
      expect(dmnContent.aggregation).to.equal(options.sheets[0].aggregation);
      expect(dmnContent.inputs).to.have.length(standardExpectedInputs().length);
      expect(dmnContent.outputs).to.have.length(standardExpectedOutput().length);
      expect(dmnContent.rules).to.have.length(standardExpectedRules().length);
    });


    it('should return processed dmn content as json with 2 Output columns', function() {

      // given
      const options = createOptions({
        sheet: {
          amountOutputs: 2
        }
      });

      // when
      const dmnContents = parseDmnContent(options);

      // then
      expect(dmnContents).to.have.length(1);

      const dmnContent = dmnContents[0];

      expect(dmnContent.name).to.be.a('string');
      expect(dmnContent.name).to.equal(options.sheets[0].tableName);
      expect(dmnContent.hitPolicy).to.be.a('string');
      expect(dmnContent.hitPolicy).to.equal(options.sheets[0].hitPolicy);

      const expectedInputs = [
        {
          label: 'amount',
          inputExpression: { text: 'amount', typeRef: 'string' }
        }
      ];
      expect(dmnContent.inputs).to.have.length(expectedInputs.length);
      expect(dmnContent.inputs[0].label).to.eql(expectedInputs[0].label);
      expect(dmnContent.inputs[0].inputExpression.text).to.eql(expectedInputs[0].inputExpression.text);
      expect(dmnContent.inputs[0].inputExpression.typeRef).to.eql(expectedInputs[0].inputExpression.typeRef);

      const expectedOutputs = [
        {
          text: 'invoiceCategory',
          name: 'invoiceCategory',
          typeRef: 'boolean'
        },
        {
          text: 'result',
          name: 'result',
          typeRef: 'string'
        }
      ];
      expect(dmnContent.outputs).to.have.length(expectedOutputs.length);
      expect(dmnContent.outputs[0].text).to.eql(expectedOutputs[0].text);
      expect(dmnContent.outputs[0].typeRef).to.eql(expectedOutputs[0].typeRef);

      const expectedRules = [
        {
          description: 'accounting',
          inputEntries: [
            { text: '<= 500' }
          ],
          outputEntries: [
            { text: 'amount < b' },
            { text: 'accounting' }
          ]
        },
        {
          description: 'anno1',
          inputEntries: [
            { text: '> 800' }
          ],
          outputEntries: [
            { text: 2 },
            { text: 'sales' }
          ]
        },
        {
          description: 'management',
          inputEntries: [
            { text: '> 500' }
          ],
          outputEntries: [
            { text: 3.56787 },
            { text: 'management' }
          ]
        }
      ];

      expect(dmnContent.rules).to.have.length(expectedRules.length);
      expect(dmnContent.rules[0].description).to.eql(expectedRules[0].description);
      expect(dmnContent.rules[0].inputEntries.length).to.eql(expectedRules[0].inputEntries.length);
      expect(dmnContent.rules[0].inputEntries[0].text).to.eql(expectedRules[0].inputEntries[0].text);
      expect(dmnContent.rules[0].outputEntries.length).to.eql(expectedRules[0].outputEntries.length);
      expect(dmnContent.rules[0].outputEntries[0].text).to.eql(expectedRules[0].outputEntries[0].text);
    });

  });


  describe('#buildXlsx', () => {

    it('should create excel file buffer', () => {

      // given
      const tables = createDecisionTables();

      // when
      const xlsxBuffer = buildXlsx(tables);

      // then
      expect(xlsxBuffer).to.exist;
    });
  });

});


// helpers ///////////////////////

const createOptions = (overrides = {}) => {
  return {
    buffer: buffer,
    sheets: [
      {
        tableName: 'myTableName',
        amountOutputs: 1,
        hitPolicy: 'UNIQUE',
        aggregation: undefined,
        ...overrides.sheet
      }
    ],
    ...overrides
  };
};

const standardExpectedInputs = () => {
  return [
    {
      id: 'Input0',
      label: 'amount',
      inputExpression: { id: 'InputExpression0', text: 'amount', typeRef: 'string' }
    },
    {
      id: 'Input1',
      label: 'invoiceCategory',
      inputExpression: { id: 'InputExpression1', text: 'invoiceCategory', typeRef: 'boolean' }
    }
  ];
};

const standardExpectedOutput = () => {
  return [
    {
      id: 'Output0',
      text: 'result',
      name: 'result',
      typeRef: 'string'
    }
  ];
};

const standardExpectedRules = () => {
  return [
    {
      id: 'Rule0',
      description: 'accounting',
      inputEntries: [
        { id: 'InputEntry00', text: '<= 500' },
        { id: 'InputEntry01', text: 'amount < b' }
      ],
      outputEntries: [{ id: 'OutputEntry00', text: 'accounting' }]
    },
    {
      id: 'Rule1',
      description: 'anno1',
      inputEntries: [
        { id: 'InputEntry10', text: '> 800' },
        { id: 'InputEntry11', text: 2 }
      ],
      outputEntries: [{ id: 'OutputEntry10', text: 'sales' }]
    },
    {
      id: 'Rule2',
      description: 'management',
      inputEntries: [
        { id: 'InputEntry20', text: '> 500' },
        { id: 'InputEntry21', text: 3.56787 }
      ],
      outputEntries: [{ id: 'OutputEntry20', text: 'management' }]
    }
  ];
};

const createDecisionTables = () => {
  return [
    {
      id: '0',
      name: 'dt0',
      inputs: [],
      outputs: [],
      rules: []
    },
    {
      id: '1',
      name: 'dt1',
      inputs: [],
      outputs: [],
      rules: []
    },
    {
      id: '2',
      name: 'dt2',
      inputs: [],
      outputs: [],
      rules: []
    }
  ];
};