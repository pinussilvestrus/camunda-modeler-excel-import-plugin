/* global describe, it */

const chai = require('chai');
const expect = chai.expect;
chai.should();
const dmnXmlGenerator = require('../../converter/dmnXmlGenerator');
const DmnModdle = require('dmn-moddle');
const dmnModdle = DmnModdle();

const createDmnContents = () => {
  return {
    name: 'myTableName',
    hitPolicy: 'UNIQUE',
    inputs: [
      { id: 'Input0', label: 'amount', inputExpression: { id: 'InputExpression0', text: 'amount', typeRef: 'string' } },
      {
        id: 'Input1',
        label: 'invoiceCategory',
        inputExpression: { id: 'InputExpression1', text: 'invoiceCategory', typeRef: 'string' }
      }
    ],
    outputs: [
      {
        id: 'Output0',
        text: 'result',
        name: 'result',
        typeRef: 'string'
      }
    ],
    rules: [
      {
        id: 'Rule0',
        description: 'accounting',
        inputEntries: [
          { id: 'InputEntry00', text: '<= 500' },
          { id: 'InputEntry01', text: '' }
        ],
        outputEntries: [ { id: 'OutputEntry00', text: 'accounting' } ]
      },
      {
        id: 'Rule1',
        description: 'anno1',
        inputEntries: [
          { id: 'InputEntry10', text: '> 800' },
          { id: 'InputEntry11', text: 'Travel Expenses' }
        ],
        outputEntries: [ { id: 'OutputEntry10', text: 'sales' } ]
      },
      {
        id: 'Rule2',
        description: 'management',
        inputEntries: [
          { id: 'InputEntry20', text: '> 500' },
          { id: 'InputEntry21', text: 'Foo' }
        ],
        outputEntries: [ { id: 'OutputEntry20', text: 'management' } ]
      }
    ]
  };
};

describe('dmnXmlGenerator', function() {
  describe('#buildXmlFromDmnContent(dmnContents)', function() {
    it('should return valid xml', function() {
      const dmnXml = dmnXmlGenerator.buildXmlFromDmnContent(createDmnContents());
      expect(dmnXml).contains('myTableName');
      expect(dmnXml).contains('amount');
      expect(dmnXml).not.contain('UNIQUE');
      expect(dmnXml).contains('InputEntry10');
      expect(dmnXml).contains('InputEntry11');
      expect(dmnXml).contains('Rule2');
      expect(dmnXml).contains('management');
      expect(dmnXml).contains('anno1');
      dmnModdle.fromXML(dmnXml, (err, definitions) => {
        if (err) {
          expect.fail(err);
        }
      });
    });
  });

  describe('#buildXmlFromDmnContent(dmnContents)', function() {
    it('should return valid xml with hit policy first', function() {
      let dmnContents = createDmnContents();
      dmnContents.hitPolicy = 'FIRST';
      const dmnXml = dmnXmlGenerator.buildXmlFromDmnContent(dmnContents);
      expect(dmnXml).contains('myTableName');
      expect(dmnXml).contains('amount');
      expect(dmnXml).contains('FIRST');
      expect(dmnXml).contains('InputEntry10');
      expect(dmnXml).contains('InputEntry11');
      expect(dmnXml).contains('Rule2');
      expect(dmnXml).contains('management');
      expect(dmnXml).contains('anno1');
      dmnModdle.fromXML(dmnXml, (err, definitions) => {
        if (err) {
          expect.fail(err);
        }
      });
    });
  });

  describe('#buildXmlFromDmnContent(dmnContents)', function() {
    it('should return valid xml with hit policy collect sum', function() {
      let dmnContents = createDmnContents();
      dmnContents.hitPolicy = 'COLLECT';
      dmnContents.aggregation = 'SUM';
      const dmnXml = dmnXmlGenerator.buildXmlFromDmnContent(dmnContents);
      expect(dmnXml).contains('myTableName');
      expect(dmnXml).contains('amount');
      expect(dmnXml).contains('COLLECT');
      expect(dmnXml).contains('SUM');
      expect(dmnXml).contains('InputEntry10');
      expect(dmnXml).contains('InputEntry11');
      expect(dmnXml).contains('Rule2');
      expect(dmnXml).contains('management');
      expect(dmnXml).contains('anno1');
      dmnModdle.fromXML(dmnXml, (err, definitions) => {
        if (err) {
          expect.fail(err);
        }
      });
    });
  });
});

