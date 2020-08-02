import * as THREE from 'three';

import {
    vec3
} from "gl-matrix";

import {
    TrackballControls
} from 'three/examples/jsm/controls/TrackballControls';



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

    let fn = (c) => {

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
    };

    let pieces = {};
    let top = cube.getFace("white");
    let bottom = cube.getFace("yellow");
    let left = cube.getFace("orange");
    let right = cube.getFace("red");
    let front = cube.getFace("green");
    let back = cube.getFace("blue");

    [top, bottom, left, right, front, back].forEach(s => {
        s.forEach(p => {
            pieces[p.key] = p;
        });
    });

    Object.keys(pieces).forEach(k => {
        fn(pieces[k]);
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

    //orbit.handleResize();
    //orbit.addEventListener('change', render);
    //camera.addEventListener('change', render);


    render();
};

export {
    render3d
};