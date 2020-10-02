const test = require('ava');
import * as THREE from 'three';


test.beforeEach(t => {

    const sut = require('../app/js2/3d/renderCubeFactory');
    const c = require('../app/js2/cube');
    const fs = require("fs");

	t.context = {
        sut: sut,
		cube: new c.Cube(fs.readFileSync("resources/default.csv", {encoding: "utf8"})) 
	};
});

test('test angle calculation', t => {


    let factory = new t.context.sut.RenderCubeFactory();
    let renderCube = factory.create(t.context.cube);

    t.true(renderCube);
});