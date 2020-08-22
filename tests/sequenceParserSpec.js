const test = require("ava");
const sinon = require("sinon");

test.beforeEach(t => {

  t.context = {
    parser: require('../app/js2/sequenceParser')
  };



});

test('placeholder', t => {

    let fn = t.context.parser.SequenceParser("L' D2 B2 D2 U2 R2 U' L R' B U L' D2 U' F U R B' D' L2 R U F D B D L B F U2");

    t.true(true);
});

/*
  let cube;

  beforeEach(function () {
    cube = jasmine.createSpyObj('cube', ['rotate', 'rotateReverse']);
  });

  it("can parse", function () {
    let fn = parser.SequenceParser("L' D2 B2 D2 U2 R2 U' L R' B U L' D2 U' F U R B' D' L2 R U F D B D L B F U2");
    fn(cube);

    expect(cube.rotate).toHaveBeenCalledTimes(31);
    expect(cube.rotateReverse).toHaveBeenCalledTimes(7);

    expect(cube.rotate.calls.all().map(c => {
      return c.args[0];
    })).toEqual([
      "yellow", "yellow",
      "blue", "blue",
      "yellow", "yellow",
      "white", "white",
      "red", "red",
      "orange",
      "blue",
      "white",
      "yellow", "yellow",
      "green",
      "white",
      "red",
      "orange", "orange",
      "red",
      "white",
      "green",
      "yellow",
      "blue",
      "yellow",
      "orange",
      "blue",
      "green",
      "white", "white"
    ]);

     expect(cube.rotateReverse.calls.all().map(c => {
      return c.args[0];
    })).toEqual([
      "orange",
      "white",
      "red",
      "orange",
      "white",
      "blue",
      "yellow",
    ]);
  });


});

*/