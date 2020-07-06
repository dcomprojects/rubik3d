/* eslint no-console:0 consistent-return:0 */
"use strict";
const d3 = require("d3");
const glm = require("gl-matrix");

const WHITE=0;
const RED=1;
const GREEN=2;
const BLUE=3;
const ORANGE=4;
const YELLOW=5;

let colorMap = {
    w: {
        value: "white",
        code: WHITE,
        direction: glm.vec3.fromValues(0,0,1)
    },
    r: {
        value: "red",
        code: RED,
        direction: glm.vec3.fromValues(1,0,0)
    },
    g: {
        value: "green",
        code: GREEN,
        direction: glm.vec3.fromValues(0,-1,0)
    },
    b: {
        value: "blue",
        code: BLUE,
        direction: glm.vec3.fromValues(0,1,0)
    },
    o: {
        value: "orange",
        code: ORANGE,
        direction: glm.vec3.fromValues(-1,0,0)
    },
    y: {
        value: "yellow",
        code: YELLOW,
        direction: glm.vec3.fromValues(0,0,-1)
    },
    '#': {
        value: "#",
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

function ColorFace(color, vector, transform) {
    Object.assign(this, {
        color: color,
        vector: glm.vec3.clone(vector),
        matrix: glm.mat4.clone(transform)
    });
}

ColorFace.prototype.position = function() {
    return glm.vec3.transformMat4(glm.vec3.create(), this.vector, this.matrix);
};

ColorFace.prototype.transform = function(m) {
    console.log(`Current: ${this.color} ${this.position()}`);
    glm.mat4.multiply(this.matrix, this.matrix, m);
    console.log(`Post Transform: ${this.color} ${this.position()}`);
};

ColorFace.prototype.toString = function() {
    return `${this.color}: ${this.position()}`; 
};

function Piece(s) {

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
        colorFaces[color] = new ColorFace(color, colorMap[c].direction, transform);
    });

    let key = colors.join("");

    Object.assign(this, {
        colorFaces: colorFaces,
        colors: colors,
        vector: glm.vec3.fromValues(0,0,0),
        position: position, //to be calculated on the fly from transform
        transform: transform,
        key: key
    });
}

Piece.prototype.rotate = function (m) {
    glm.vec3.transformMat4(this.position, this.position, m);
    Object.keys(this.ijk).forEach(k => {
        this.ijk[k].transform(m);
    });
};

Piece.prototype.toString = function() {

    let blah = "";

    Object.keys(this.ijk).forEach(a => {
        let c  = this.ijk[a];
        blah += `${a}: ${c.colorFace}
`;
    });

    return `
Colors: ${this.colors}
Position: ${this.position}
Key: ${this.key}
Color Faces: ${blah}
`;

};

Piece.prototype.position2 = function() {
    return glm.vec3.transformMat4(glm.vec3.create(), this.vector, this.transform);
};

Piece.prototype.get = function(color) {
    console.log("blah");
    //console.log(this.ijk[color].colorFace.toString());
    //return this.ijk[color].colorFace.position();

    console.log(this.colorFaces[color].toString());
    return this.colorFaces[color].position();
};

function Cube5(csv) {

    let parser = d3.dsvFormat("|");
    let data = parser.parse(csv);

    this.pieces = new Map();

    data.forEach(r => {
        let v = new Piece(r.data);
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
        if (glm.vec3.dot(p.position, dir) === 1) {
            console.log(p.toString());
            p.rotate(rota);
            console.log(p.toString());
        }
    }

};

Cube5.prototype.get = function(key) {
    return this.pieces.get(key);
};

module.exports = Cube5;