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
import {Animation as MyAnimation} from './animation';

import {RenderCubeFactory} from './renderCubeFactory';
import {RotationHelper} from './getRotation';
import { Euler } from 'three/build/three.module';


let render3d = (cube, changeHandler) => {

    const divCube = document.querySelector("div.cube");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, divCube.clientWidth / divCube.clientHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(divCube.clientWidth, divCube.clientHeight);

    divCube.appendChild(renderer.domElement);

    let animations = [];

    let factory = new RenderCubeFactory();
    let cubeGroup2 = factory.create(cube);

    scene.add(cubeGroup2);

    let cPos = new THREE.Vector3(0, 0, 7);
    camera.position.x = cPos.x;
    camera.position.y = cPos.y;
    camera.position.z = cPos.z;

    let orbit = new TrackballControls2(camera, renderer.domElement);
    orbit.rotateSpeed = 2;

    let drift = 0;
    let drifting = false;

    orbit.addEventListener("change", (e) => {
        changeHandler(e);
        drifting = true;
        drift = 0;
    });

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
        animations.unshift(new MyAnimation(0.5, axis, rad, cube.getFace(face).map(p => cubeGroup2.getByKey(p.key)))); 

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

   const colorMap = {
       "g": "green",
       "o": "orange",
       "b": "blue",
       "r": "red",
       "w": "white",
       "y": "yellow"
   };

   const colorToKey = {
       "green": "g",
       "orange": "o",
       "blue": "b",
       "red": "r",
        "white": "w",
        "yellow": "y"
   };

    let centers = cubeGroup2.children.filter(e => e.userData.piece.isCenter());

    orientation.calculate = function () {

        this.rayCaster.setFromCamera({
            x: 0,
            y: 0
        }, camera);

        let _target = new THREE.Vector3();
        let _cameraPos = new THREE.Vector3();
        camera.getWorldPosition(_cameraPos);

        //let centers = cubeGroup2.children.filter(e => e.userData.piece.isCenter());
        let distances = centers.map(e => e.getWorldPosition(_target).distanceToSquared(_cameraPos));

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
                e.getWorldPosition(_target).clone().applyMatrix4(camera.matrixWorldInverse),
                front.getWorldPosition(_target).clone().applyMatrix4(camera.matrixWorldInverse))
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

        /*
        console.log(`Front: ${front.userData.piece.key}`);
        console.log(`Left: ${left.userData.piece.key}`);
        console.log(`Back: ${back.userData.piece.key}`);
        console.log(`Right: ${right.userData.piece.key}`);
        console.log(`Top: ${top.userData.piece.key}`);
        console.log(`Bottom: ${bottom.userData.piece.key}`);
        */

        return {
            "front": colorMap[front.userData.piece.key],
            "left": colorMap[left.userData.piece.key],
            "back": colorMap[back.userData.piece.key],
            "right": colorMap[right.userData.piece.key],
            "up": colorMap[top.userData.piece.key],
            "down": colorMap[bottom.userData.piece.key]
        };

    }.bind(orientation);

    orientation.frontFaceAngle = function () {

        let cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);

        let _target = new THREE.Vector3();
        let _cameraPos = new THREE.Vector3();
        camera.getWorldPosition(_cameraPos);
        //let centers = cubeGroup2.children.filter(e => e.userData.piece.isCenter());
        let distances = centers.map(e => e.getWorldPosition(_target).distanceToSquared(_cameraPos));

        let front = centers[scan(distances)];

        let frontPos = new THREE.Vector3();
        front.getWorldPosition(frontPos);
        camera.worldToLocal(frontPos);

        let directions = {};
        centers.forEach(c => {
            let centerPos = new THREE.Vector3();
            c.getWorldPosition(centerPos);
            camera.worldToLocal(centerPos);

            directions[colorMap[c.userData.piece.key]] = centerPos.sub(frontPos).normalize();
        });

        return Object.assign(directions, {
            "x": frontPos.x,
            "y": frontPos.y,
            "z": frontPos.z,
        });
    };

    let getRotationAngle = (e, cam, cg) => {

        let camWorldDir = new THREE.Vector3();
        cam.getWorldDirection(camWorldDir);

        console.log(`Cam World Dir 
        ${camWorldDir.x} ${camWorldDir.y} ${camWorldDir.z}
        `);

        let _target = new THREE.Vector3();
        let _cameraPos = new THREE.Vector3();
        cam.getWorldPosition(_cameraPos);
        let centers = cg.children.filter(e => e.userData.piece.isCenter());
        let distances = centers.map(e => e.getWorldPosition(_target).distanceToSquared(_cameraPos));

        const blah = {};
        let front = centers[scan(distances)];

        console.log(`Front:`);
        console.log(front.userData.piece);

        let frontWorldDir = new THREE.Vector3();
        front.getWorldDirection(frontWorldDir);
        console.log(`Front World Dir 
        ${frontWorldDir.x} ${frontWorldDir.y} ${frontWorldDir.z}
        `);

        console.log(`Dot: ${camWorldDir.dot(frontWorldDir)}`);
        console.log(`AngleTo: ${THREE.MathUtils.radToDeg(camWorldDir.angleTo(frontWorldDir))}`);

        return Math.PI / 3.0;
    };

    orbit.addEventListener("click", (e) => {
        console.log(e);

        //let angle = getRotationAngle(e, camera, cubeGroup2);

        let angle = Math.PI/3.0;
        if (Math.abs(e.x) > Math.abs(e.y)) {

            if (e.x < 0) {
                angle *= -1;
            }

            animations.unshift(new MyAnimation(0.3, e.verticalAxis, angle, [cubeGroup2]));
        } else {

            if (e.y >= 0) {
                angle *= -1;
            }
            animations.unshift(new MyAnimation(0.3, e.horizontalAxis, angle, [cubeGroup2]));
        }
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

            let pos = cubeGroup2.getByKey(p.key).position.clone();

            let m1 = new THREE.Matrix4().makeTranslation(-pos.x, -pos.y, -pos.z);
            let r1 = new THREE.Matrix4().makeRotationAxis(
                axis,
                Math.PI / 2.0
            );
            let m2 = new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z);

            let m = new THREE.Matrix4();
            m.multiplyMatrices(r1, m2);
            m.multiplyMatrices(m, m1);
            cubeGroup2.getByKey(p.key).applyMatrix4(m);

        });
    }, true);

    let targetDir = new THREE.Vector3().set(0.42, -0.50, -6.24).normalize();

    let rotationHelper = new RotationHelper(camera, cube, cubeGroup2);
    let applyDrift = function() {

        let o = orientation.calculate();
        let frontKey = colorToKey[o.front];

        let ori = {};
        Object.keys(o).forEach(k => {
            ori[k] = cubeGroup2.getByKey(colorToKey[o[k]]).position;
        });

        let rota = rotationHelper.getRotationToNormalizedPosition(
            ori,
            new THREE.Euler(THREE.MathUtils.degToRad(30), THREE.MathUtils.degToRad(30))
        );

        animations.unshift(new MyAnimation(0.3, new THREE.Vector3(), 0, [cubeGroup2]).qauternion(rota.delta));
    };

    let render = () => {
        requestAnimationFrame(render);

        if (animations.length) {
            changeHandler();

            animations[animations.length - 1].init();

            if (!animations[animations.length - 1].tick()) {
                animations.pop();
            }
        }

        if (drifting) {
            drift += 1;

            if (drift >= 90) {
                applyDrift();
                drifting = false;
                drift = 0;
            }
        }

        orbit.update();
        renderer.render(scene, camera);
    };

    render();

    animations.unshift(new MyAnimation(0.5, new THREE.Vector3(1, 0, 0), Math.PI/6.0, [cubeGroup2]));
    animations.unshift(new MyAnimation(0.5, new THREE.Vector3(0, 1, 0), Math.PI/6.0, [cubeGroup2]));

    return orientation;
};

function CubeHandler3d(cube) {
    this.cube = cube;
}

CubeHandler3d.prototype.render3d = function(fn) {
    this.orientationCalculator = render3d(this.cube, fn);
}; 


CubeHandler3d.prototype.getOrientationMap = function() {
    return this.orientationCalculator.calculate();
}; 

CubeHandler3d.prototype.getFrontFaceAngle = function() {
    return this.orientationCalculator.frontFaceAngle();
};


export {
    CubeHandler3d
};