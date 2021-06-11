const chai = require('chai');

const expect = chai.expect;
chai.should();
chai.use(require('chai-string'));

const buildXmlFromDmnContent = require('../../converter/dmnXmlGenerator').buildXmlFromDmnContent;

const DmnModdle = require('dmn-moddle');

const dmnModdle = DmnModdle();


describe('dmnXmlGenerator', () => {

  describe('#buildXmlFromDmnContent(dmnContents)', () => {

    it('should return valid xml', () => {

      // when
      const dmnXml = buildXmlFromDmnContent(createDmnContents());

      // then
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


    it('should return valid xml - multiple sheets', () => {

      // given
      const sheets = [
        ...createDmnContents(),
        ...createDmnContents(),
        ...createDmnContents()
      ];

      // when
      const dmnXml = buildXmlFromDmnContent(sheets);

      // then
      expect(dmnXml).to.have.entriesCount('<decision id=', 3);

      dmnModdle.fromXML(dmnXml, (err, definitions) => {
        if (err) {
          expect.fail(err);
        }
      });

    });


    it('should return valid xml with hit policy first', () => {

      // given
      const dmnContents = createDmnContents({
        sheet: {
          hitPolicy: 'FIRST'
        }
      });

      // when
      const dmnXml = buildXmlFromDmnContent(dmnContents);

      // then
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


    it('should return valid xml with hit policy collect sum', () => {

      // given
      const dmnContents = createDmnContents({
        sheet: {
          hitPolicy: 'COLLECT',
          aggregation: 'SUM'
        }
      });

      // when
      const dmnXml = buildXmlFromDmnContent(dmnContents);
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


// helper /////////////////////

const createDmnContents = (overrides = {}) => {
  const {
    sheet,
    sheets = []
  } = overrides;

  const newSheet = {
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
    ],
    ...sheet
  };

  return [ newSheet, ...sheets ];
};

