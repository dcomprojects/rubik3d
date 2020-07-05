describe("Cube", function() {
  var Cube2 = require('../../app/js/cube/cube2');
  var fs = require("fs");
  var cube;

  beforeEach(function() {
    cube = new Cube2(fs.readFileSync("resources/default.csv", {encoding: "utf8"}));
  });

  it("should be able to play a Song", function() {
    //console.log(cube.toString());
    cube.rotate("white");

    console.log(corner.toString());

    //expect(cube.orientation.front).toEqual("blah");

    //demonstrates use of custom matcher
    //expect(player).toBePlaying(song);
  });

});