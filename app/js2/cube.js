/* eslint no-console:0 consistent-return:0 */
"use strict";

import {vec3, mat4} from "gl-matrix";
import {dsvFormat} from "d3";
import {SequenceParser} from "./sequenceParser";

const WHITE=0;
const RED=1;
const GREEN=2;
const BLUE=3;
const ORANGE=4;
const YELLOW=5;

let ColorMap = {
    w: {
        value: "white",
        key: "w",
        code: WHITE,
        direction: vec3.fromValues(0,0,1),
        adjacent: ["b", "g", "o", "r"],
    },
    r: {
        value: "red",
        key: "r",
        code: RED,
        direction: vec3.fromValues(1,0,0),
        adjacent: ["w", "y", "g", "b"],
    },
    g: {
        value: "green",
        key: "g",
        code: GREEN,
        direction: vec3.fromValues(0,-1,0),
        adjacent: ["w", "y", "o", "r"],
    },
    b: {
        value: "blue",
        key: "b",
        code: BLUE,
        direction: vec3.fromValues(0,1,0),
        adjacent: ["w", "y", "r", "o"],
    },
    o: {
        value: "orange",
        key: "o",
        code: ORANGE,
        direction: vec3.fromValues(-1,0,0),
        adjacent: ["w", "y", "b", "g"],
    },
    y: {
        value: "yellow",
        key: "y",
        code: YELLOW,
        direction: vec3.fromValues(0,0,-1),
        adjacent: ["g", "b", "o", "r"],
    },
    '#': {
        value: "#",
        key: "#",
        direction: vec3.fromValues(0,0,0)
    }
};

const COLORS = new Array(6);
COLORS[WHITE] = ColorMap.w; 
COLORS[GREEN] = ColorMap.g; 
COLORS[RED] = ColorMap.r; 
COLORS[BLUE] = ColorMap.b; 
COLORS[ORANGE] = ColorMap.o; 
COLORS[YELLOW] = ColorMap.y; 

let FACES = {
    white: ColorMap.w,
    red: ColorMap.r,
    green: ColorMap.g,
    blue: ColorMap.b,
    orange: ColorMap.o,
    yellow: ColorMap.y
};

function ColorFace(cube, color, vector, transform) {
    Object.assign(this, {
        color: color,
        vector: vec3.clone(vector),
        parentTransform: transform,
        cube: cube
    });
}

ColorFace.prototype.position = function() {
    return vec3.transformMat4(vec3.create(), this.vector, this.parentTransform);
};

ColorFace.prototype.toString = function() {
    return `${this.color}: ${this.position()}`; 
};

ColorFace.prototype.adjacentCenter = function() {

    let pos = this.position();
    let max;
    let ret;

    Object.keys(FACES).forEach(k => {
        let f = FACES[k];
        let p = this.cube.get(f.key);
        let dot = vec3.dot(p.get(f.value), pos);

        if (!max || max < dot) {
            max = dot;
            ret = p; 
        }
    });

    return ret;
};

function Piece(cube, s) {

    let i = 0;
    let colorFaces = {};
    let colors = [];

    let position = vec3.create();
    s.split(",").map(c => {
        if (c !== '#') {
            colors.push(c);
            i++;
        }
        vec3.add(position, position, ColorMap[c].direction);
    });

    let transform = mat4.fromTranslation(mat4.create(), position);
    s.split(",").map(c => {

        let color = ColorMap[c].value;
        colorFaces[color] = new ColorFace(cube, color, ColorMap[c].direction, transform);
    });

    let key = colors.join("");

    Object.assign(this, {
        colorFaces: colorFaces,
        colors: colors,
        vector: vec3.fromValues(0,0,0),
        position: position, //to be calculated on the fly from transform
        transform: transform,
        key: key,
        cube: cube
    });
}

Piece.prototype.rotate = function (m) {
    mat4.mul(this.transform, m, this.transform);
};

Piece.prototype.isEdge = function () {
    return this.colors.length == 2;
};

Piece.prototype.isCenter = function () {
    return this.colors.length == 1;
};

Piece.prototype.isCorner = function () {
    return this.colors.length == 3;
};

Piece.prototype.toString = function() {

    return `
Colors: ${this.colors}
Position: ${this.position2()}
Key: ${this.key}
Color Faces: ${this.colorFaces}
`;

};

Piece.prototype.position2 = function() {
    return vec3.transformMat4(vec3.create(), this.vector, this.transform);
};

Piece.prototype.get = function(color) {
    return this.colorFaces[color].position();
};

Piece.prototype.getColors = function() {
    return this.colorFaces; 
};

Piece.prototype.getFaceColor = function(color) {

    let colorValue = ColorMap[color].value;
    let ret;
    Object.keys(this.colorFaces).forEach(k => {
        let cf = this.colorFaces[k]; 

        if (cf.color !== "#" && cf.adjacentCenter().key === color) {
            //console.log(cf);
            ret = cf.color;
        }
    });

    return ret;
};

function Cube(csv) {

    let parser = dsvFormat("|");
    let data = parser.parse(csv);

    this.pieces = new Map();

    data.forEach(r => {
        let v = new Piece(this, r.data);
        this.pieces.set(v.key, v);
    });

    this.faceRotations = {};

    Object.keys(FACES).forEach(f => {

        let dir = FACES[f].direction;
        let cw = mat4.fromRotation(mat4.create(), -Math.PI/2.0, dir);

        let tr1 = mat4.fromTranslation(mat4.create(), vec3.scale(vec3.create(), dir, -1));  
        let tr2 = mat4.fromTranslation(mat4.create(), dir); 

        let rota = mat4.mul(mat4.create(), 
            cw, tr1
        );

        mat4.mul(rota, tr2, rota);

        this.faceRotations[f] = rota;
    });
}

Cube.prototype.toString = function() {

    let ret = "";

    for (const p of this.pieces.keys()) {
       ret += `${this.pieces.get(p)}
`;
    }

    return ret;
};

Cube.prototype.onRotate = function(fn) {
    this.rotateCallBack = fn;
};

Cube.prototype.onRotateReverse = function(fn) {
    this.rotateReverseCallBack = fn;
};

Cube.prototype.rotate = function(face) {

    console.log(`Rotate: ${face}`);

    if (this.rotateCallBack) {
        this.rotateCallBack(face);
    }

    for (const k of this.pieces.keys()) {

        let p = this.pieces.get(k); 
        let rota = this.faceRotations[face];
        let dir = FACES[face].direction; 
        if (vec3.dot(p.position2(), dir) === 1) {
            //console.log(p.toString());
            p.rotate(rota);
            //console.log(p.toString());
        }
    }

};

Cube.prototype.rotateReverse = function(face) {

    console.log(`Rotate: ${face}`);
    if (this.rotateReverseCallBack) {
        this.rotateReverseCallBack(face);
    }

    for (const k of this.pieces.keys()) {

        let p = this.pieces.get(k); 
        let rota = mat4.invert(mat4.create(), this.faceRotations[face]);
        let dir = FACES[face].direction; 
        if (vec3.dot(p.position2(), dir) === 1) {
            //console.log(p.toString());
            p.rotate(rota);
            //console.log(p.toString());
        }
    }

};

Cube.prototype.get = function(key) {
    return this.pieces.get(key);
};

Cube.prototype.getByPosition = function(key) {

    let vec = vec3.create();
    key.split("").forEach(c => {
        vec3.add(vec, vec, ColorMap[c].direction);
    });

    for (const k of this.pieces.keys()) {
        let p = this.pieces.get(k);
        if (vec3.equals(p.position2(), vec)) {
            return p;
        }
    }

    return undefined;
};

Cube.prototype.getFace = function(color) {

    let dir = FACES[color].direction;

    let ret = [];
    for (const k of this.pieces.keys()) {
        let p = this.pieces.get(k);
        if (vec3.dot(p.position2(), dir) === 1) {
            ret.push(p);
        }
    }

    return ret;
};

Cube.prototype.getFacePiecePositions = function(faceColor)
{
    let a1 = [faceColor];
    let a2 = [
        ColorMap[faceColor].adjacent[0], 
        "",
        ColorMap[faceColor].adjacent[1], 
    ];
    let a3 = [
        ColorMap[faceColor].adjacent[2], 
        "",
        ColorMap[faceColor].adjacent[3], 
    ];

    let ret = [];
    for(const c1 of a1) {
        for(const c2 of a2) {
            for (const c3 of a3) {
                ret.push(`${c1}${c3}${c2}`);
            }
        }
    } 
    return ret;
};

Cube.prototype.getFaceColors = function(face) {

    if (!(face in ColorMap)) {
        face = FACES[face].key;
    }

    return this.getFacePiecePositions(face)
        .map(p => this.getByPosition(p))
        .map(pos => pos.getFaceColor(face));

};

let opposites = {
    "r": "o",
    "o": "r",
    "g": "b",
    "b": "g",
    "y": "w",
    "w": "y",
};

Cube.prototype.getOpposite = function(key) {
    return this.get(opposites[key]);
};

Cube.prototype.scramble = function() {
    console.log("Scramble requested");

    let scramble = SequenceParser("L' D2 B2 D2 U2 R2 U' L R' B U L' D2 U' F U R B' D' L2 R U F D B D L B F U2");
    scramble(this);

};

export {Cube, ColorMap};
