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

let ROTATIONS = {
    white: glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, colorMap.w.direction),
    red: glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, colorMap.r.direction),
    green: glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, colorMap.g.direction),
    blue: glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, colorMap.b.direction),
    orange: glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, colorMap.o.direction),
    yellow: glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, colorMap.y.direction),
};

function Cube4() {

    COLORS.forEach(cm => {
        let tr = glm.mat3.fromTranslation(glm.mat3.create(), 
        glm.vec3.scale(glm.vec3.create(), cm.direction, -1));
        let rotation = glm.mat4.fromRotation(glm.mat4.create(), -Math.PI/2.0, cm.direction);
        let tf = glm.mat3.fromTranslation(glm.mat3.create(), cm.direction);  

        let m1 = glm.mat3.multiply(glm.mat3.create(), rotation, tr);
        glm.mat3.multiply(m1, tf, m1); 

        cm.rotation = m1;
    });

}

Cube4.prototype.rotate = function(face) {

};

module.exports = Cube4;