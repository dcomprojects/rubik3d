describe("System Test", function () {
    var parser = require('../../app/js/cube/sequenceParser');
    var Cube = require('../../app/js/cube/cube');
    var fs = require("fs");
  
    beforeEach(function () {
      cube = new Cube(fs.readFileSync("resources/default3.csv", {
        encoding: "utf8"
      }));
    });
    
    it("can scramble cube and have correct faces", function () {

        let scramble = parser.SequenceParser("L' D2 B2 D2 U2 R2 U' L R' B U L' D2 U' F U R B' D' L2 R U F D B D L B F U2");
        scramble(cube);

        expect([
            "obw", "ow", "ogw",
            "ob", "o", "og",
            "oby", "oy", "ogy",
          ].map(pos => cube.getByPosition(pos).getFaceColor("o"))).toEqual(
            [
            "blue", "white", "orange",  
            "white", "orange", "white",  
            "orange", "blue", "red",  
          ]);

    });
  
  });
  