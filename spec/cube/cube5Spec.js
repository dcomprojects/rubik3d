describe("Cube5", function () {
  var Cube5 = require('../../app/js/cube/cube5');
  var fs = require("fs");
  var cube;

  beforeEach(function () {
    cube = new Cube5(fs.readFileSync("resources/default3.csv", {
      encoding: "utf8"
    }));
  });

  it("Initialize Cube", function () {
    cube.rotate("white");
    cube.rotate("red");
    //cube.rotate("red");
    //cube.rotate("green");
  });

});