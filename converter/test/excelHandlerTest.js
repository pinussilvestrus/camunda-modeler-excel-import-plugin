const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const excelHandler = require('../excelHandler');
const fs = require("fs");
const buffer = fs.readFileSync('./test/example.xlsx');

const standardOptions = () => {
    return {
        buffer: buffer,
        tableName: "myTableName",
        amountOutputs: 1,
        hitPolicy: "UNIQUE",
        aggregation: undefined
    };
}

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
    ]
}

const standardExpectedOutput = () => {
    return [
        {
            id: 'Output0',
            text: 'result',
            name: 'result',
            typeRef: 'string'
        }
    ]
}

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
    ]
}

describe('excelHandler', function () {

    describe('#getDmnContent(buffer, tableName, amountOutputs, hitPolicy, aggregation)', function () {
        it('should return processed dmn content as json', function () {
            const options = standardOptions();
            const dmnContent = excelHandler.getDmnContent(options);
            expect(dmnContent.name).to.be.a('string');
            expect(dmnContent.name).to.equal(options.tableName);
            expect(dmnContent.hitPolicy).to.be.a('string');
            expect(dmnContent.hitPolicy).to.equal(options.hitPolicy);
            expect(dmnContent.inputs).to.eql(standardExpectedInputs());
            expect(dmnContent.outputs).to.eql(standardExpectedOutput());
            expect(dmnContent.rules).to.eql(standardExpectedRules());
        });
    });

    describe('#getDmnContent(buffer, tableName, amountOutputs, hitPolicy, aggregation)', function () {
        it('should return processed dmn content as json with hit policy COLLECT SUM', function () {
            let options = standardOptions();
            options.hitPolicy = "COLLECT";
            options.aggregation = "SUM";
            const dmnContent = excelHandler.getDmnContent(options);
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
    });

    describe('#getDmnContent(buffer, tableName, amountOutputs, hitPolicy, aggregation)', function () {
        it('should return processed dmn content as json with 2 Output columns', function () {
            let options = standardOptions();
            options.amountOutputs = 2;
            const dmnContent = excelHandler.getDmnContent(options);
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
            ]
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
            ]

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
            ]
            expect(dmnContent.rules).to.eql(expectedRules);
        });
    });

    describe('#getDmnContent(buffer, tableName, amountOutputs, hitPolicy, aggregation)', function () {
        it('should return processed dmn content as json with 2 annotations unequal to result', function () {
            let options = standardOptions();
            options.buffer = fs.readFileSync('./test/exampleAnnotations.xlsx');
            const dmnContent = excelHandler.getDmnContent(options);
            expect(dmnContent.name).to.be.a('string');
            expect(dmnContent.name).to.equal(options.tableName);
            expect(dmnContent.hitPolicy).to.be.a('string');
            expect(dmnContent.hitPolicy).to.equal(options.hitPolicy);
            expect(dmnContent.inputs).to.eql(standardExpectedInputs());
            expect(dmnContent.outputs).to.eql(standardExpectedOutput());

            let expectedRules = standardExpectedRules();
            expectedRules[1].description = "anno1";
            expectedRules[2].description = "anno2";

            expect(dmnContent.rules).to.eql(expectedRules);
        });
    });

    describe('#getDmnContent(buffer, tableName, amountOutputs, hitPolicy, aggregation)', function () {
        it('should return processed dmn content as json with 3 different types', function () {
            let options = standardOptions();
            options.buffer = fs.readFileSync('./test/exampleTypes.xlsx');
            const dmnContent = excelHandler.getDmnContent(options);
            expect(dmnContent.name).to.be.a('string');
            expect(dmnContent.name).to.equal(options.tableName);
            expect(dmnContent.hitPolicy).to.be.a('string');
            expect(dmnContent.hitPolicy).to.equal(options.hitPolicy);

            const expectedInputs = () => {
                return [
                    {
                        id: 'Input0',
                        label: 'amount',
                        inputExpression: { id: 'InputExpression0', text: 'amount', typeRef: 'string' }
                    },
                    {
                        id: 'Input1',
                        label: 'invoiceCategory',
                        inputExpression: { id: 'InputExpression1', text: 'invoiceCategory', typeRef: 'double' }
                    }
                ]
            }
            
            const expectedOutput = () => {
                return [
                    {
                        id: 'Output0',
                        text: 'result',
                        name: 'result',
                        typeRef: 'integer'
                    }
                ]
            }

            expect(dmnContent.inputs).to.eql(expectedInputs());
            expect(dmnContent.outputs).to.eql(expectedOutput());
        });
    });
});