import * as THREE from 'three';
import {
    vec3
} from "gl-matrix";

let render3d = (cube) => {

    const divCube = document.querySelector("div.cube");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, divCube.clientWidth / divCube.clientHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(divCube.clientWidth, divCube.clientHeight);

    divCube.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    var material = new THREE.MeshBasicMaterial({
        //color: 0x00ff00
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


    //top is cube.getFace("white") 9 pieces 
    //left is cube.getFace("orange") 3 pieces 
    //right is cube.getFace("red") 3 pieces
    //bottom is cube.getFace("yellow") 9 pieces 
    //front is cube.getFace("green") 1 piece
    //back is cube.getFace("blue") 1 piece

    /*
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                let g = geometry.clone();

                g.faces.forEach(f => {
                    f.color.setRGB(Math.random(),
                        Math.random(), Math.random());
                });

                let cube = new THREE.Mesh(g, material);
                cube.position.set(i - 1, j - 1, k - 1);
                group.add(cube);
            }
        }
    }
    */

    scene.add(group);

    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame(animate);

        group.rotation.x += 0.01;
        group.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    animate();
};

export {
    render3d
};