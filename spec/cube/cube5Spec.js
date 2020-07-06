describe("Cube5", function () {
  var Cube5 = require('../../app/js/cube/cube5');
  var glm = require("gl-matrix");
  var fs = require("fs");
  var cube;

  beforeEach(function () {
    cube = new Cube5(fs.readFileSync("resources/default3.csv", {
      encoding: "utf8"
    }));
  });

  it("Initialize Cube", function () {

    //-x orange face
    expect(cube.get("ogy").position2()).toEqual(glm.vec3.fromValues(-1, -1, -1));
    expect(cube.get("oy").position2()).toEqual(glm.vec3.fromValues(-1, 0, -1));
    expect(cube.get("oby").position2()).toEqual(glm.vec3.fromValues(-1, 1, -1));

    expect(cube.get("og").position2()).toEqual(glm.vec3.fromValues(-1, -1, 0));
    expect(cube.get("o").position2()).toEqual(glm.vec3.fromValues(-1, 0, 0));
    expect(cube.get("ob").position2()).toEqual(glm.vec3.fromValues(-1, 1, 0));

    expect(cube.get("ogw").position2()).toEqual(glm.vec3.fromValues(-1, -1, 1));
    expect(cube.get("ow").position2()).toEqual(glm.vec3.fromValues(-1, 0, 1));
    expect(cube.get("obw").position2()).toEqual(glm.vec3.fromValues(-1, 1, 1));

    //-y green face
    expect(cube.get("ogy").position2()).toEqual(glm.vec3.fromValues(-1, -1, -1));
    expect(cube.get("gy").position2()).toEqual(glm.vec3.fromValues(0, -1, -1));
    expect(cube.get("rgy").position2()).toEqual(glm.vec3.fromValues(1, -1, -1));

    expect(cube.get("og").position2()).toEqual(glm.vec3.fromValues(-1, -1, 0));
    expect(cube.get("g").position2()).toEqual(glm.vec3.fromValues(0, -1, 0));
    expect(cube.get("rg").position2()).toEqual(glm.vec3.fromValues(1, -1, 0));

    expect(cube.get("ogw").position2()).toEqual(glm.vec3.fromValues(-1, -1, 1));
    expect(cube.get("gw").position2()).toEqual(glm.vec3.fromValues(0, -1, 1));
    expect(cube.get("rgw").position2()).toEqual(glm.vec3.fromValues(1, -1, 1));

    //-z yellow face
    expect(cube.get("ogy").position2()).toEqual(glm.vec3.fromValues(-1, -1, -1));
    expect(cube.get("gy").position2()).toEqual(glm.vec3.fromValues(0, -1, -1));
    expect(cube.get("rgy").position2()).toEqual(glm.vec3.fromValues(1, -1, -1));

    expect(cube.get("oy").position2()).toEqual(glm.vec3.fromValues(-1, 0, -1));
    expect(cube.get("y").position2()).toEqual(glm.vec3.fromValues(0, 0, -1));
    expect(cube.get("ry").position2()).toEqual(glm.vec3.fromValues(1, 0, -1));

    expect(cube.get("oby").position2()).toEqual(glm.vec3.fromValues(-1, 1, -1));
    expect(cube.get("by").position2()).toEqual(glm.vec3.fromValues(0, 1, -1));
    expect(cube.get("rby").position2()).toEqual(glm.vec3.fromValues(1, 1, -1));
 
    //+x red face
    expect(cube.get("rgy").position2()).toEqual(glm.vec3.fromValues(1, -1, -1));
    expect(cube.get("ry").position2()).toEqual(glm.vec3.fromValues(1, 0, -1));
    expect(cube.get("rby").position2()).toEqual(glm.vec3.fromValues(1, 1, -1));

    expect(cube.get("rg").position2()).toEqual(glm.vec3.fromValues(1, -1, 0));
    expect(cube.get("r").position2()).toEqual(glm.vec3.fromValues(1, 0, 0));
    expect(cube.get("rb").position2()).toEqual(glm.vec3.fromValues(1, 1, 0));

    expect(cube.get("rgw").position2()).toEqual(glm.vec3.fromValues(1, -1, 1));
    expect(cube.get("rw").position2()).toEqual(glm.vec3.fromValues(1, 0, 1));
    expect(cube.get("rbw").position2()).toEqual(glm.vec3.fromValues(1, 1, 1));

    //+y blue face
    expect(cube.get("oby").position2()).toEqual(glm.vec3.fromValues(-1, 1, -1));
    expect(cube.get("by").position2()).toEqual(glm.vec3.fromValues(0, 1, -1));
    expect(cube.get("rby").position2()).toEqual(glm.vec3.fromValues(1, 1, -1));

    expect(cube.get("ob").position2()).toEqual(glm.vec3.fromValues(-1, 1, 0));
    expect(cube.get("b").position2()).toEqual(glm.vec3.fromValues(0, 1, 0));
    expect(cube.get("rb").position2()).toEqual(glm.vec3.fromValues(1, 1, 0));

    expect(cube.get("obw").position2()).toEqual(glm.vec3.fromValues(-1, 1, 1));
    expect(cube.get("bw").position2()).toEqual(glm.vec3.fromValues(0, 1, 1));
    expect(cube.get("rbw").position2()).toEqual(glm.vec3.fromValues(1, 1, 1));

    //+z white face
    expect(cube.get("ogw").position2()).toEqual(glm.vec3.fromValues(-1, -1, 1));
    expect(cube.get("gw").position2()).toEqual(glm.vec3.fromValues(0, -1, 1));
    expect(cube.get("rgw").position2()).toEqual(glm.vec3.fromValues(1, -1, 1));

    expect(cube.get("ow").position2()).toEqual(glm.vec3.fromValues(-1, 0, 1));
    expect(cube.get("w").position2()).toEqual(glm.vec3.fromValues(0, 0, 1));
    expect(cube.get("rw").position2()).toEqual(glm.vec3.fromValues(1, 0, 1));

    expect(cube.get("obw").position2()).toEqual(glm.vec3.fromValues(-1, 1, 1));
    expect(cube.get("bw").position2()).toEqual(glm.vec3.fromValues(0, 1, 1));
    expect(cube.get("rbw").position2()).toEqual(glm.vec3.fromValues(1, 1, 1));
 
    //cube.rotate("white");
    //cube.rotate("red");
    //cube.rotate("red");
    //cube.rotate("green");
  });

});