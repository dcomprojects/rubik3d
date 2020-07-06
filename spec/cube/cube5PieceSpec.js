describe("Cube5 Pieces", function () {
  var Cube5 = require('../../app/js/cube/cube5');
  var glm = require("gl-matrix");
  var fs = require("fs");
  var cube;

  beforeEach(function () {
    cube = new Cube5(fs.readFileSync("resources/default3.csv", {
      encoding: "utf8"
    }));
  });

  it("are initialized", function () {

    //-x orange face
    expect(cube.get("ogy").get("orange")).toEqual(glm.vec3.fromValues(-2, -1, -1));
    expect(cube.get("ogy").get("green")).toEqual(glm.vec3.fromValues(-1, -2, -1));
    expect(cube.get("ogy").get("yellow")).toEqual(glm.vec3.fromValues(-1, -1, -2));
  });

});