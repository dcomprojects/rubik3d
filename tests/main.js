const test = require('ava');
const glm = require('gl-matrix');

test.beforeEach(t => {

    const c = require('../app/js2/cube');
    const fs = require("fs");

	t.context = {
		cube: new c.Cube(fs.readFileSync("resources/default.csv", {encoding: "utf8"})) 
	};
});

test('initialize cube', t => {

    t.true(glm.vec3.equals(
        t.context.cube.get("ogy").position2(), 
        glm.vec3.fromValues(-1, -1, -1)
        )); 
    t.true(glm.vec3.equals(
        t.context.cube.get("oy").position2(), 
        glm.vec3.fromValues(-1, 0, -1)
        )); 
    t.true(glm.vec3.equals(
        t.context.cube.get("oby").position2(), 
        glm.vec3.fromValues(-1, 1, -1)
        )); 



});