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

function doColorFaces(s) {

    let colors = s.split(",");

    let ret = {};

    ["i", "j", "k"].forEach((d, idx) => {
        let color = colorMap[colors[idx]].value;
        let dir = colorMap[colors[idx]].direction;
        let matrix = glm.mat4.fromTranslation(glm.mat4.create(), dir);

        let transform = function (m) {
            glm.vec3.transformMat4(this.dir, this.dir, m);
        };

        let o = {
            dir: glm.vec3.clone(dir),
            matrix: matrix,
        };
        o.transform = transform.bind(o);

        ret[color] = o;
    });


    return ret;
}

function Piece(s) {

    let colors = []; 
    let i = 0;

    let position = glm.vec3.create();
    s.split(",").map(c => {
        if (c !== '#') {
            i++;
            colors.push(c);
        }
        glm.vec3.add(position, position, colorMap[c].direction);
    });

    let ijk = doColorFaces(s);

    let key = colors.join("");

    Object.assign(this, {
        colors: colors,
        position: position,
        key: key,
        ijk: ijk
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
        blah += `${a}: ${c.dir}
`;
    });

    return `
Colors: ${this.colors}
Position: ${this.position}
Key: ${this.key}
Color Faces: ${blah}
`;

};

function Cube5(csv) {

    let parser = d3.dsvFormat("|");
    let data = parser.parse(csv);

    this.pieces = new Map();

    data.forEach(r => {
        let v = new Piece(r["data"]);
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

module.exports = Cube5;