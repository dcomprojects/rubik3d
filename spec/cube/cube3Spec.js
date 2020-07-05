describe("Cube3", function () {
  var Cube3 = require('../../app/js/cube/cube3');
  var fs = require("fs");
  var cube;

  beforeEach(function () {
    cube = new Cube3(fs.readFileSync("resources/default3.csv", {
      encoding: "utf8"
    }));
  });

  it("Initialize Cube", function () {
    //console.log(cube.toString());
    cube.rotate("white");
    cube.rotate("red");
    console.log(cube.getFacePieces("red"));
  });

});