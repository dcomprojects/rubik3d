const test = require('ava');
import * as THREE from 'three';
import { Vector3 } from 'three/build/three.module';


test.beforeEach(t => {

    const sut = require('../app/js2/3d/getRotation');
    const c = require('../app/js2/cube');
    const factory = require('../app/js2/3d/renderCubeFactory');
    const fs = require("fs");

	t.context = {
        sut: sut,
        factory: factory,
		cube: new c.Cube(fs.readFileSync("resources/default.csv", {encoding: "utf8"})) 
	};
});

test('rotation calculation', t => {

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(60, 1600/900, 0.1, 1000);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 7;

    camera.lookAt(0,0,0);

    let factory = new t.context.factory.RenderCubeFactory();
    let cubeGroup = factory.create(t.context.cube);

    scene.add(cubeGroup);

    let q1 = new THREE.Quaternion(); 
    q1.setFromAxisAngle(new THREE.Vector3(1,0,0), THREE.MathUtils.degToRad(25));
    cubeGroup.applyQuaternion(q1);

    q1.setFromAxisAngle(new THREE.Vector3(0,1,0), THREE.MathUtils.degToRad(40)); 
    cubeGroup.applyQuaternion(q1);
    cubeGroup.updateMatrixWorld(true); 

    let rh = new t.context.sut.RotationHelper(camera, t.context.cube, cubeGroup);
    let blah = rh.getRotationToNormalizedPosition("w", new THREE.Euler(
            THREE.MathUtils.degToRad(30), 
            THREE.MathUtils.degToRad(30), 
            0));

    let v = new THREE.Vector3();
    cubeGroup.getByKey("w").getWorldPosition(v);

    //console.log(blah);
    t.true(blah);
}

);

test('blah', t => {

    let dtr = THREE.MathUtils.degToRad;
    let rtd = THREE.MathUtils.radToDeg;

    let qStart = new THREE.Quaternion();
    let qEnd = new THREE.Quaternion();
    let delta = new THREE.Quaternion();

    qStart.setFromEuler(new THREE.Euler(dtr(70), dtr(45))).normalize(); 
    qEnd.setFromEuler(new THREE.Euler(dtr(5), dtr(85))).normalize(); 

    delta.multiplyQuaternions(qEnd, qStart.clone().conjugate());

    let e = new THREE.Vector3().fromArray(new THREE.Euler()
        .setFromQuaternion(delta)
        .toVector3()
        .toArray()
        .map(e => rtd(e)))
        .round();

    t.deepEqual(e, new THREE.Vector3(-69, 13, 38));

    let e2 = new THREE.Vector3().fromArray(new THREE.Euler()
        .setFromQuaternion(qStart.premultiply(delta))
        .toVector3()
        .toArray()
        .map(e => rtd(e)))
        .round();

    let e3 = new THREE.Vector3().fromArray(new THREE.Euler()
        .setFromQuaternion(qEnd)
        .toVector3()
        .toArray()
        .map(e => rtd(e)))
        .round();

    t.deepEqual(e2, e3);

}
);

