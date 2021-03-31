const chai = require('chai');

const expect = chai.expect;
chai.should();

const fs = require('fs');

const buildJsonFromXML = require('../../converter/dmnJsonGenerator').buildJsonFromXML;

const buffer = fs.readFileSync(__dirname + '/../fixtures/diagram.dmn', 'utf8');


describe('dmnJsonGenerator', () => {

  describe('#buildJsonFromXML(xml)', () => {

    it('should return decision tables', async () => {

      // when
      const decisionTables = await buildJsonFromXML({ xml: buffer });

      // then
      expect(decisionTables).to.exist;
      expect(decisionTables.length).to.equal(3);
      expect(decisionTables).to.deep.equal([
        {
          id: 'dish-decision',
          inputs: [ 'Season', 'How many guests' ],
          outputs: [ 'Dish' ],
          rules: [
            [ '"Winter"', '<= 8', '"Spareribs"' ],
            [ '"Winter"', '> 8', '"Pasta"' ],
            [ '"Summer"', '> 10', '"Light salad"' ],
            [ '"Summer"', '<= 10', '"Beans salad"' ],
            [ '"Spring"', '< 10', '"Stew"' ],
            [ '"Spring"', '>= 10', '"Steak"' ]
          ],
          name: 'Dish Decision'
        },
        {
          id: 'season',
          inputs: [ 'Weather in Celsius' ],
          outputs: [ 'season' ],
          rules: [
            [ '>30', '"Summer"' ],
            [ '<10', '"Winter"' ],
            [ '[10..30]', '"Spring"' ]
          ],
          name: 'Season decision'
        },
        {
          id: 'guestCount',
          inputs: [ 'Type of day' ],
          outputs: [ 'Guest count' ],
          rules: [
            [ '"Weekday"', '4' ],
            [ '"Holiday"', '10' ],
            [ '"Weekend"', '15' ]
          ],
          name: 'Guest Count'
        }
      ]);

    });

  });

});

