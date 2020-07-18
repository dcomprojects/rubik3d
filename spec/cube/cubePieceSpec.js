describe("Cube Pieces", function () {
  var Cube = require('../../app/js/cube/cube');
  var glm = require("gl-matrix");
  var fs = require("fs");
  var cube;

  beforeEach(function () {
    cube = new Cube(fs.readFileSync("resources/default3.csv", {
      encoding: "utf8"
    }));
  });

  it("are initialized", function () {

    //ogy color vectors
    expect(cube.get("ogy").get("orange")).toEqual(glm.vec3.fromValues(-2, -1, -1));
    expect(cube.get("ogy").get("green")).toEqual(glm.vec3.fromValues(-1, -2, -1));
    expect(cube.get("ogy").get("yellow")).toEqual(glm.vec3.fromValues(-1, -1, -2));
  });
it("can get colors", function () {
    expect(cube.get("ogy").getColors().orange.position()).toEqual(glm.vec3.fromValues(-2,-1,-1));
    expect(cube.get("ogy").getColors().orange.adjacentCenter().key).toEqual("o");

    expect(cube.get("bw").getColors().white.position()).toEqual(glm.vec3.fromValues(0,1,2));
    expect(cube.get("bw").getColors().white.adjacentCenter().key).toEqual("w");

    expect(cube.get("r").getColors().red.position()).toEqual(glm.vec3.fromValues(2,0,0));
    expect(cube.get("r").getColors().red.adjacentCenter().key).toEqual("r");
  });

});