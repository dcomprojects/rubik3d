const test = require('ava');
import * as THREE from 'three';


test.beforeEach(t => {

    const sut = require('../app/js2/3d/getRotation');
    const c = require('../app/js2/cube');
    const fs = require("fs");

	t.context = {
        sut: sut,
		cube: new c.Cube(fs.readFileSync("resources/default.csv", {encoding: "utf8"})) 
	};
});

test('test angle calculation', t => {

    let camera = new THREE.PerspectiveCamera(60, 1600/900, 0.1, 1000);

    let rh = new t.context.sut.RotationHelper(camera, t.context.cube);
    let blah = rh.getRotationToNormalizedPosition("abc");
    t.true(blah);
});