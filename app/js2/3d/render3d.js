import * as THREE from 'three';

import {
    vec3
} from "gl-matrix";

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';


let render3d = (cube) => {

    const divCube = document.querySelector("div.cube");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, divCube.clientWidth / divCube.clientHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(divCube.clientWidth, divCube.clientHeight);

    divCube.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors
    });

    let group = new THREE.Group();

    let fn = (c) => {

        let g = geometry.clone();
        console.log(c.colorFaces);
        Object.keys(c.colorFaces).forEach(k => {
            let cf = c.colorFaces[k];

            g.faces.forEach(f => {
                let dot = vec3.dot(vec3.fromValues(
                    f.normal.x,
                    f.normal.y,
                    f.normal.z), cf.vector);

                if (dot === 1) {
                    f.color.setColorName(k);
                } else if (dot === -1) {
                    f.color.setColorName("black");
                }

            });
        });

        let m = new THREE.Mesh(g, material);
        m.position.set(
            c.position2()[0],
            c.position2()[1],
            c.position2()[2]);
        group.add(m);
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


    scene.add(group);

    camera.position.z = 5;

    let render = () => {
        renderer.render(scene, camera);
    };

    let orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    orbit.addEventListener('change', render);

    render();
};

export {
    render3d
};