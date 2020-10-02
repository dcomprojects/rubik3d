import * as THREE from 'three';

import {
    vec3
} from "gl-matrix";

let RenderCubeFactory = function () {

    let buildPiece = (function (cubePiece) {

        let pieceGeom = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        pieceGeom.faces.forEach((f, i) => {
            f.materialIndex = i;
        });

        return (cubePiece) => {

            let faceMaterials = [];

            pieceGeom.faces.forEach(f => {

                let fmat = new THREE.MeshBasicMaterial({
                    color: new THREE.Color("black")
                });

                faceMaterials.push(fmat);

                Object.keys(cubePiece.colorFaces).forEach(k => {
                    let cf = cubePiece.colorFaces[k];

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

            let pos = cubePiece.position2();

            m.position.set(
                pos[0],
                pos[1],
                pos[2]);
            m.userData = {
                piece: cubePiece
            };

            return m;
        };

    }());

    this.create = (function () {

        return (cube) => {

            let cubeGroup = new THREE.Group();

            ["red", "green", "blue", "white", "yellow", "orange"].forEach(color => {

                let face = cube.getFace(color);

                face.forEach(facePiece => {

                    if (!(facePiece.key in cubeGroup.userData)) {

                        let piece = buildPiece(facePiece);
                        cubeGroup.add(piece);
                        cubeGroup.userData[facePiece.key] = piece;
                    }

                });
            });

            cubeGroup.getByKey = (key) => {
                return cubeGroup.userData[key];
            };

            return cubeGroup;
        };

    }());

};

export {
    RenderCubeFactory
};