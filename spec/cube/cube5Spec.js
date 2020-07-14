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

  it("initializes cube", function () {

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
  });

  it("can get face pieces", function () {

    let pieces = cube.getFace("red").map(p => p.key).sort();
    expect(pieces.length).toEqual(9);
    expect(pieces).toEqual([
      "r", 
      "rb", "rbw", "rby",
      "rg", "rgw", "rgy",
      "rw", "ry"
  ]);
  });
it("can rotate", function () {

  cube.rotate("white");
  let pieces = cube.getFace("red").map(p => p.key).sort();
  expect(pieces.length).toEqual(9);
  expect(pieces).toEqual([
    "rbw", "bw", "obw",
    "rg", "r", "rb",
    "rgy", "ry", "rby"]
    .sort()
  );

});

it("can rotate twice", function () {

  cube.rotate("white");
  cube.rotate("red");
  let pieces = cube.getFace("red").map(p => p.key).sort();
  expect(pieces.length).toEqual(9);
  expect(pieces).toEqual([
    "rgy", "rg", "rbw",
    "ry", "r", "bw",
    "rby", "rb", "obw"]
    .sort()
  );

  let face = cube.getFace("orange");

  let topLeft = face 
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,-1,1), e.position2()));
  let topCenter = face 
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,0,1), e.position2()));
  let topRight = face 
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,1,1), e.position2()));

  let centerLeft = face
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,-1,0), e.position2()));
  let center = face
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,0,0), e.position2()));
  let centerRight = face
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,1,0), e.position2()));

  let bottomLeft = face
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,-1,-1), e.position2()));
  let bottomCenter = face
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,0,-1), e.position2()));
  let bottomRight = face
    .find(e => glm.vec3.equals(glm.vec3.fromValues(-1,1,-1), e.position2()));

    expect(topLeft.key).toEqual("rgw");
    expect(topCenter.key).toEqual("gw");
    expect(topRight.key).toEqual("ogw");

    expect(centerLeft.key).toEqual("og");
    expect(center.key).toEqual("o");
    expect(centerRight.key).toEqual("ob");

    expect(bottomLeft.key).toEqual("ogy");
    expect(bottomCenter.key).toEqual("oy");
    expect(bottomRight.key).toEqual("oby");
});

it("can rotate reverse", function () {

  cube.rotateReverse("white");
  let pieces = cube.getFace("red").map(p => p.key).sort();
  expect(pieces.length).toEqual(9);
  expect(pieces).toEqual([
    "ogw", "gw", "rgw",
    "rg", "r", "rb",
    "rgy", "ry", "rby"]
    .sort()
  );
});

it("can rotate three times", function () {

  cube.rotate("white");
  cube.rotate("red");
  cube.rotateReverse("white");
  let face = cube.getFace("orange");

  let rbw = face
    .find(e => e.key === "rbw");

  expect(rbw.getColors().white.adjacentCenter().key).toEqual("o");
});

it("can get by position", function() {

  expect(cube.getByPosition("rgy").key).toEqual("rgy");

});

it("can get by position after rotations", function() {

  cube.rotate("white");
  cube.rotate("red");
  cube.rotateReverse("white");
  expect(cube.getByPosition("obw").key).toEqual("rbw");
  expect(cube.getByPosition("obw").getFaceColor("o")).toEqual("white");
  expect(cube.getByPosition("obw").getFaceColor("b")).toEqual("blue");
  expect(cube.getByPosition("obw").getFaceColor("w")).toEqual("red");

});

it("can get entire face", function() {

  cube.rotate("white");
  cube.rotate("red");
  cube.rotateReverse("white");

  expect(cube.getByPosition("ob").getFaceColor("b")).toEqual("blue");

  //to get an entire face
  expect([
    "obw", "bw", "rbw",
    "ob", "b", "rb",
    "oby", "by", "rby",
  ].map(pos => cube.getByPosition(pos).getFaceColor("b"))).toEqual(
    [
    "blue", "red", "red",  
    "blue", "blue", "white",  
    "blue", "blue", "white",  
  ]);

  expect([
    "obw", "ow", "ogw",
    "ob", "o", "og",
    "oby", "oy", "ogy",
  ].map(pos => cube.getByPosition(pos).getFaceColor("o"))).toEqual(
    [
    "white", "orange", "orange",  
    "orange", "orange", "orange",  
    "orange", "orange", "orange",  
  ]);

});

it("can get current face colors", function() {


  expect(cube.getColorsByFace("blah")).toEqual(
    [
      "a"
    ]);

});


});