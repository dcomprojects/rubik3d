import * as THREE from 'three';

import {
    vec3
} from "gl-matrix";

import {
    TrackballControls
} from 'three/examples/jsm/controls/TrackballControls';
import {
    Matrix4
} from 'three';



let render3d = (cube) => {

    const divCube = document.querySelector("div.cube");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, divCube.clientWidth / divCube.clientHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(divCube.clientWidth, divCube.clientHeight);

    divCube.appendChild(renderer.domElement);

    var pieceGeom = new THREE.BoxGeometry(0.98, 0.98, 0.98);

    let cubeGroup = new THREE.Group();

    pieceGeom.faces.forEach((f, i) => {
        f.materialIndex = i;
    });

    let fn = (c, pMap) => {

        console.log(c.colorFaces);

        let faceMaterials = [];

        pieceGeom.faces.forEach(f => {

            let fmat = new THREE.MeshBasicMaterial({
                color: new THREE.Color("black")
            });

            faceMaterials.push(fmat);

            Object.keys(c.colorFaces).forEach(k => {
                let cf = c.colorFaces[k];

                let dot = vec3.dot(vec3.fromValues(
                    f.normal.x,
                    f.normal.y,
                    f.normal.z), cf.vector);

                if (dot === 1) {
                    fmat.color.setColorName(k);
                }
            });
        });

        let m = new THREE.Mesh(pieceGeom, faceMaterials);
        m.position.set(
            c.position2()[0],
            c.position2()[1],
            c.position2()[2]);
        cubeGroup.add(m);
        pMap[c.key] = m;

        Object.keys(c.colorFaces).forEach(k => {
            console.log(`Expected color ${k}`);
            if (k in groups) {}
        });
    };

    let pieces = {};
    let top = cube.getFace("white");
    let bottom = cube.getFace("yellow");
    let left = cube.getFace("orange");
    let right = cube.getFace("red");
    let front = cube.getFace("green");
    let back = cube.getFace("blue");

    let groups = {};
    ["white", "yellow", "orange", "red", "green", "blue"].forEach(c => {
        groups[c] = new THREE.Group();
        scene.add(groups[c]);
    });

    [top, bottom, left, right, front, back].forEach(s => {
        s.forEach(p => {
            pieces[p.key] = p;
        });
    });

    let pMap = {};
    Object.keys(pieces).forEach(k => {
        fn(pieces[k], pMap);
    });

    scene.add(cubeGroup);

    camera.position.z = 5;
    camera.position.y = 1;

    let orbit = new TrackballControls(camera, renderer.domElement);
    orbit.rotateSpeed = 10;

    let render = () => {
        requestAnimationFrame(render);
        orbit.update();
        renderer.render(scene, camera);
    };

    const rotateMap = {
        "red": new THREE.Vector3(1, 0, 0),
        "white": new THREE.Vector3(0, 0, 1),
        "blue": new THREE.Vector3(0, 1, 0),
        "orange": new THREE.Vector3(-1, 0, 0),
        "yellow": new THREE.Vector3(0, 0, -1),
        "green": new THREE.Vector3(0, -1, 0)
    };

    const rFn = (face, rad) => {

        let axis = rotateMap[face]; 

        cube.getFace(face).forEach(p => {

            let pos = pMap[p.key].position.clone();

            let m1 = new THREE.Matrix4().makeTranslation(-pos.x, -pos.y, -pos.z);
            let r1 = new THREE.Matrix4().makeRotationAxis(
                axis,
                rad
                //-Math.PI / 2.0
            );
            let m2 = new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z);

            let m = new Matrix4();
            m.multiplyMatrices(r1, m2);
            m.multiplyMatrices(m, m1);
            pMap[p.key].applyMatrix4(m);

        });
    };

    cube.onRotate((face) => {
        rFn(face, -Math.PI / 2.0);
    });

    cube.onRotateReverse((face) => {
        rFn(face, Math.PI / 2.0);
    });

    window.addEventListener('keydown', (e) => {

        console.log(`keyCode: ${e.keyCode}`);
        const keyMap = {
            82: {
                "axis": new THREE.Vector3(1, 0, 0),
                "face": "red"
            },
            87: {
                "axis": new THREE.Vector3(0, 0, 1),
                "face": "white"
            },

        };

        if (!(e.keyCode in keyMap)) {
            return;
        }

        let axis = keyMap[e.keyCode].axis;
        let face = keyMap[e.keyCode].face;

        cube.getFace(face).forEach(p => {

            let pos = pMap[p.key].position.clone();

            let m1 = new THREE.Matrix4().makeTranslation(-pos.x, -pos.y, -pos.z);
            let r1 = new THREE.Matrix4().makeRotationAxis(
                axis,
                Math.PI / 2.0
            );
            let m2 = new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z);

            let m = new Matrix4();
            m.multiplyMatrices(r1, m2);
            m.multiplyMatrices(m, m1);
            pMap[p.key].applyMatrix4(m);

        });
    }, true);

    render();
};

export {
    render3d
};