import * as THREE from 'three';

import {
    vec3
} from "gl-matrix";

import {
    TrackballControls2
} from './TrackballControls2';

import {
    scan,
    descending,
    min,
    ascending
} from 'd3';



let render3d = (cube, changeHandler) => {

    const divCube = document.querySelector("div.cube");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, divCube.clientWidth / divCube.clientHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(divCube.clientWidth, divCube.clientHeight);

    divCube.appendChild(renderer.domElement);

    var pieceGeom = new THREE.BoxGeometry(0.95, 0.95, 0.95);

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
        m.userData = {
            piece: c
        };
        cubeGroup.add(m);
        pMap[c.key] = m;
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

    let pMap = {};
    Object.keys(pieces).forEach(k => {
        fn(pieces[k], pMap);
    });

    scene.add(cubeGroup);

    /*
    camera.position.z = 5;
    camera.position.y = 1;
    camera.position.x = -7;
    */

    camera.position.z = 2.5788751967444594;
    camera.position.x = -4.368264013205228;
    camera.position.y = 2.8252303672987282;

    let orbit = new TrackballControls2(camera, renderer.domElement);
    orbit.rotateSpeed = 2;

    orbit.addEventListener("change", (e) => {
        /*
        console.log(`
        ${camera.position.x} 
        ${camera.position.y} 
        ${camera.position.z}
`);
        */
        changeHandler(e);
    });

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

            let m = new THREE.Matrix4();
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

    const orientation = {
        domElement: renderer.domElement,
        rayCaster: new THREE.Raycaster(),
    };

    orientation.calculate = function () {

        this.rayCaster.setFromCamera({
            x: 0,
            y: 0
        }, camera);

        let a = this.rayCaster.intersectObjects(cubeGroup.children);

        let centers = cubeGroup.children.filter(e => e.userData.piece.isCenter());
        let distances = centers.map(e => e.position.distanceToSquared(camera.position));

        const blah = {};
        let front = centers[scan(distances)];
        //let back = centers[scan(distances, descending)];

        let back = centers.find(e => e.userData.piece.key === cube.getOpposite(front.userData.piece.key).key);
        let others = centers.filter(e => 
                e.userData.piece.key !== front.userData.piece.key && 
                e.userData.piece.key !== back.userData.piece.key 
                );

        others.forEach(e => blah[e.userData.piece.key] =
            new THREE.Vector3().subVectors(
                e.position.clone().applyMatrix4(camera.matrixWorldInverse),
                front.position.clone().applyMatrix4(camera.matrixWorldInverse))
            .normalize());

        let left = others[scan(others, (a, b) => {
            return ascending(
                blah[a.userData.piece.key].x,
                blah[b.userData.piece.key].x);
        })];

        let right = others[scan(others, (a, b) => {
            return descending(
                blah[a.userData.piece.key].x,
                blah[b.userData.piece.key].x);
        })];
        right = others.find(e => e.userData.piece.key === cube.getOpposite(left.userData.piece.key).key);

        let bottom = others[scan(others, (a, b) => {
            return ascending(
                blah[a.userData.piece.key].y,
                blah[b.userData.piece.key].y);
        })];

        let top = others[scan(others, (a, b) => {
            return descending(
                blah[a.userData.piece.key].y,
                blah[b.userData.piece.key].y);
        })];
        top = others.find(e => e.userData.piece.key === cube.getOpposite(bottom.userData.piece.key).key);

        console.log(`Front: ${front.userData.piece.key}`);
        console.log(`Left: ${left.userData.piece.key}`);
        console.log(`Back: ${back.userData.piece.key}`);
        console.log(`Right: ${right.userData.piece.key}`);
        console.log(`Top: ${top.userData.piece.key}`);
        console.log(`Bottom: ${bottom.userData.piece.key}`);

        const colorMap = {
            "g": "green",
            "o": "orange",
            "b": "blue",
            "r": "red",
            "w": "white",
            "y": "yellow"
        };

        return {
            "front": colorMap[front.userData.piece.key],
            "left": colorMap[left.userData.piece.key],
            "back": colorMap[back.userData.piece.key],
            "right": colorMap[right.userData.piece.key],
            "up": colorMap[top.userData.piece.key],
            "down": colorMap[bottom.userData.piece.key]
        };

    }.bind(orientation);

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

            let m = new THREE.Matrix4();
            m.multiplyMatrices(r1, m2);
            m.multiplyMatrices(m, m1);
            pMap[p.key].applyMatrix4(m);

        });
    }, true);

    render();

    return orientation.calculate;
};

function CubeHandler3d(cube) {
    this.cube = cube;
}

CubeHandler3d.prototype.render3d = function(fn) {
    this.orientationCalculator = render3d(this.cube, fn);
}; 


CubeHandler3d.prototype.getOrientationMap = function() {

    return this.orientationCalculator();

    /*
    return {
        "up": "white",
        "front": "green",
        "left": "orange",
        "right": "red",
        "down": "yellow",
        "back": "blue"
    };
    */
}; 


export {
    CubeHandler3d
};