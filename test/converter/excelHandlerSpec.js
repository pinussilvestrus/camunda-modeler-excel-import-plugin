const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

const parseDmnContent = require('../../converter/excelHandler').parseDmnContent,
      buildXlsx = require('../../converter/excelHandler').buildXlsx;

const buffer = fs.readFileSync(__dirname + '/../fixtures/example.xlsx');


describe('excelHandler', () => {

  describe('#getDmnContent(buffer, tableName, amountOutputs, hitPolicy, aggregation)', () => {

    it('should return processed dmn content as json', () => {

      // given
      const options = createOptions();

      // when
      const dmnContent = parseDmnContent(options);

      // then
      expect(dmnContent.name).to.be.a('string');
      expect(dmnContent.name).to.equal(options.tableName);
      expect(dmnContent.hitPolicy).to.be.a('string');
      expect(dmnContent.hitPolicy).to.equal(options.hitPolicy);
      expect(dmnContent.inputs).to.eql(standardExpectedInputs());
      expect(dmnContent.outputs).to.eql(standardExpectedOutput());
      expect(dmnContent.rules).to.eql(standardExpectedRules());
    });


    it('should return processed dmn content as json with hit policy COLLECT SUM', () => {

      // given
      const options = createOptions({
        hitPolicy: 'COLLECT',
        aggregation: 'SUM'
      });

      // when
      const dmnContent = parseDmnContent(options);

      // then
      expect(dmnContent.name).to.be.a('string');
      expect(dmnContent.name).to.equal(options.tableName);
      expect(dmnContent.hitPolicy).to.be.a('string');
      expect(dmnContent.hitPolicy).to.equal(options.hitPolicy);
      expect(dmnContent.aggregation).to.be.a('string');
      expect(dmnContent.aggregation).to.equal(options.aggregation);
      expect(dmnContent.inputs).to.eql(standardExpectedInputs());
      expect(dmnContent.outputs).to.eql(standardExpectedOutput());
      expect(dmnContent.rules).to.eql(standardExpectedRules());
    });


    it('should return processed dmn content as json with 2 Output columns', function() {

      // given
      const options = createOptions({
        amountOutputs: 2
      });

      // when
      const dmnContent = parseDmnContent(options);

      // then
      expect(dmnContent.name).to.be.a('string');
      expect(dmnContent.name).to.equal(options.tableName);
      expect(dmnContent.hitPolicy).to.be.a('string');
      expect(dmnContent.hitPolicy).to.equal(options.hitPolicy);

      const expectedInputs = [
        {
          id: 'Input0',
          label: 'amount',
          inputExpression: { id: 'InputExpression0', text: 'amount', typeRef: 'string' }
        }
      ];
      expect(dmnContent.inputs).to.eql(expectedInputs);

      const expectedOutputs = [
        {
          id: 'Output0',
          text: 'invoiceCategory',
          name: 'invoiceCategory',
          typeRef: 'boolean'
        },
        {
          id: 'Output1',
          text: 'result',
          name: 'result',
          typeRef: 'string'
        }
      ];
      expect(dmnContent.outputs).to.eql(expectedOutputs);

      const expectedRules = [
        {
          id: 'Rule0',
          description: 'accounting',
          inputEntries: [
            { id: 'InputEntry00', text: '<= 500' }
          ],
          outputEntries: [
            { id: 'OutputEntry00', text: 'amount < b' },
            { id: 'OutputEntry01', text: 'accounting' }
          ]
        },
        {
          id: 'Rule1',
          description: 'anno1',
          inputEntries: [
            { id: 'InputEntry10', text: '> 800' }
          ],
          outputEntries: [
            { id: 'OutputEntry10', text: 2 },
            { id: 'OutputEntry11', text: 'sales' }
          ]
        },
        {
          id: 'Rule2',
          description: 'management',
          inputEntries: [
            { id: 'InputEntry20', text: '> 500' }
          ],
          outputEntries: [
            { id: 'OutputEntry20', text: 3.56787 },
            { id: 'OutputEntry21', text: 'management' }
          ]
        }
      ];
      expect(dmnContent.rules).to.eql(expectedRules);
    });

  });


  describe('#buildXlsx(decisionTables)', () => {

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

const createOptions = (overrides) => {
  return {
    buffer: buffer,
    tableName: 'myTableName',
    amountOutputs: 1,
    hitPolicy: 'UNIQUE',
    aggregation: undefined,
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