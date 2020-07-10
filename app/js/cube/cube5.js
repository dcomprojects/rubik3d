/* eslint no-console:0 consistent-return:0 */
"use strict";
const d3 = require("d3");
const glm = require("gl-matrix");
//const { ConsoleReporter } = require("jasmine");

const WHITE=0;
const RED=1;
const GREEN=2;
const BLUE=3;
const ORANGE=4;
const YELLOW=5;

let colorMap = {
    w: {
        value: "white",
        key: "w",
        code: WHITE,
        direction: glm.vec3.fromValues(0,0,1)
    },
    r: {
        value: "red",
        key: "r",
        code: RED,
        direction: glm.vec3.fromValues(1,0,0)
    },
    g: {
        value: "green",
        key: "g",
        code: GREEN,
        direction: glm.vec3.fromValues(0,-1,0)
    },
    b: {
        value: "blue",
        key: "b",
        code: BLUE,
        direction: glm.vec3.fromValues(0,1,0)
    },
    o: {
        value: "orange",
        key: "o",
        code: ORANGE,
        direction: glm.vec3.fromValues(-1,0,0)
    },
    y: {
        value: "yellow",
        key: "y",
        code: YELLOW,
        direction: glm.vec3.fromValues(0,0,-1)
    },
    '#': {
        value: "#",
        key: "#",
        direction: glm.vec3.fromValues(0,0,0)
    }
};

const COLORS = new Array(6);
COLORS[WHITE] = colorMap.w; 
COLORS[GREEN] = colorMap.g; 
COLORS[RED] = colorMap.r; 
COLORS[BLUE] = colorMap.b; 
COLORS[ORANGE] = colorMap.o; 
COLORS[YELLOW] = colorMap.y; 

let FACES = {
    white: colorMap.w,
    red: colorMap.r,
    green: colorMap.g,
    blue: colorMap.b,
    orange: colorMap.o,
    yellow: colorMap.y
};

function ColorFace(cube, color, vector, transform) {
    Object.assign(this, {
        color: color,
        vector: glm.vec3.clone(vector),
        parentTransform: transform,
        cube: cube
    });
}

ColorFace.prototype.position = function() {
    return glm.vec3.transformMat4(glm.vec3.create(), this.vector, this.parentTransform);
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
        let dot = glm.vec3.dot(p.get(f.value), pos);

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

    let position = glm.vec3.create();
    s.split(",").map(c => {
        if (c !== '#') {
            colors.push(c);
            i++;
        }
        glm.vec3.add(position, position, colorMap[c].direction);
    });

    let transform = glm.mat4.fromTranslation(glm.mat4.create(), position);
    s.split(",").map(c => {

        let color = colorMap[c].value;
        colorFaces[color] = new ColorFace(cube, color, colorMap[c].direction, transform);
    });

    let key = colors.join("");

    Object.assign(this, {
        colorFaces: colorFaces,
        colors: colors,
        vector: glm.vec3.fromValues(0,0,0),
        position: position, //to be calculated on the fly from transform
        transform: transform,
        key: key,
        cube: cube
    });
}

Piece.prototype.rotate = function (m) {
    glm.mat4.mul(this.transform, m, this.transform);
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
    return glm.vec3.transformMat4(glm.vec3.create(), this.vector, this.transform);
};

Piece.prototype.get = function(color) {
    return this.colorFaces[color].position();
};

Piece.prototype.getColors = function() {
    return this.colorFaces; 
};

Piece.prototype.getFaceColor = function(color) {

    let colorValue = colorMap[color].value;
    let ret;
    Object.keys(this.colorFaces).forEach(k => {
        let cf = this.colorFaces[k]; 

        if (cf.color !== "#" && cf.adjacentCenter().key === color) {
            console.log(cf);
            ret = cf.color;
        }
    });

    return ret;
};

function Cube5(csv) {

    let parser = d3.dsvFormat("|");
    let data = parser.parse(csv);

    this.pieces = new Map();

    data.forEach(r => {
        let v = new Piece(this, r.data);
        this.pieces.set(v.key, v);
    });

    this.faceRotations = {};

    Object.keys(FACES).forEach(f => {

        let dir = FACES[f].direction;
        let cw = glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, dir);

        let tr1 = glm.mat4.fromTranslation(glm.mat4.create(), glm.vec3.scale(glm.vec3.create(), dir, -1));  
        let tr2 = glm.mat4.fromTranslation(glm.mat4.create(), dir); 

        let rota = glm.mat4.mul(glm.mat4.create(), 
            cw, tr1
        );

        glm.mat4.mul(rota, tr2, rota);

        this.faceRotations[f] = rota;
    });
}

Cube5.prototype.toString = function() {

    let ret = "";

    for (const p of this.pieces.keys()) {
       ret += `${this.pieces.get(p)}
`;
    }

    return ret;
};

Cube5.prototype.rotate = function(face) {

    console.log(`Rotate: ${face}`);
    for (const k of this.pieces.keys()) {

        let p = this.pieces.get(k); 
        let rota = this.faceRotations[face];
        let dir = FACES[face].direction; 
        if (glm.vec3.dot(p.position2(), dir) === 1) {
            console.log(p.toString());
            p.rotate(rota);
            console.log(p.toString());
        }
    }

};

Cube5.prototype.rotateReverse = function(face) {

    console.log(`Rotate: ${face}`);
    for (const k of this.pieces.keys()) {

        let p = this.pieces.get(k); 
        let rota = glm.mat4.invert(glm.mat4.create(), this.faceRotations[face]);
        let dir = FACES[face].direction; 
        if (glm.vec3.dot(p.position2(), dir) === 1) {
            console.log(p.toString());
            p.rotate(rota);
            console.log(p.toString());
        }
    }

};

Cube5.prototype.get = function(key) {
    return this.pieces.get(key);
};

Cube5.prototype.getByPosition = function(key) {

    let vec = glm.vec3.create();
    key.split("").forEach(c => {
        glm.vec3.add(vec, vec, colorMap[c].direction);
    });

    for (const k of this.pieces.keys()) {
        let p = this.pieces.get(k);
        if (glm.vec3.equals(p.position2(), vec)) {
            return p;
        }
    }

    return undefined;
};

Cube5.prototype.getFace = function(color) {

    let dir = FACES[color].direction;

    let ret = [];
    for (const k of this.pieces.keys()) {
        let p = this.pieces.get(k);
        if (glm.vec3.dot(p.position2(), dir) === 1) {
            ret.push(p);
        }
    }

    return ret;
};

module.exports = Cube5;