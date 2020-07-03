/* eslint no-console:0 consistent-return:0 */
"use strict";
const d3 = require("d3");

const WHITE=0
const RED=1
const GREEN=2
const BLUE=3
const ORANGE=4
const YELLOW=5

let colorMap = {
    w: {
        value: "white",
        code: WHITE
    },
    r: {
        value: "red",
        code: RED
    },
    g: {
        value: "green",
        code: GREEN
    },
    b: {
        value: "blue",
        code: BLUE
    },
    o: {
        value: "orange",
        code: ORANGE
    },
    y: {
        value: "yellow",
        code: YELLOW
    },
};

const COLORS = new Array(6);
COLORS[WHITE] = colorMap.w; 
COLORS[GREEN] = colorMap.g; 
COLORS[RED] = colorMap.r; 
COLORS[BLUE] = colorMap.b; 
COLORS[ORANGE] = colorMap.o; 
COLORS[YELLOW] = colorMap.y; 

const makeKey = (k) => {
    return k.split("").sort().join("");
};

function Corner(color1, color2, color3) {

    let c1 = colorMap[color1];
    let c2 = colorMap[color2];
    let c3 = colorMap[color3];

    let mapping = {};

    mapping[c1.value] = c1.code;
    mapping[c2.value] = c2.code;
    mapping[c3.value] = c3.code;

    Object.assign(this, {
        slots: mapping,
        key: makeKey([color1, color2, color3].join("")) 
    });
}

Corner.prototype.toString = function() {

   let ret = "";
    Object.keys(this.slots).forEach(s => {
        ret += `${s} -> ${COLORS[this.slots[s]].value}\n`;
    });

    return ret;
};

Corner.prototype.getKey = function() {
    return this.key;
};

function Edge(color1, color2) {

    let c1 = colorMap[color1];
    let c2 = colorMap[color2];

    let mapping = {};

    mapping[c1.value] = c1.code;
    mapping[c2.value] = c2.code;

    Object.assign(this, {slots: 
        mapping
    });
}

Edge.prototype.toString = function() {

    let ret = "";
    Object.keys(this.slots).forEach(s => {
        ret += `${s} -> ${COLORS[this.slots[s]].value}\n`;
    });

    return ret;
};


function Side(c1, e, c2) {

    Object.assign(this, {
        corner1: c1,
        edge: e,
        corner2: c2
    });

}

Side.prototype.toString = function() {
    return `
Corner1:
${this.corner1.toString()}
Edge:
${this.edge.toString()}
Corner2:
${this.corner2.toString()}`;
};

Side.prototype.getMappings = function() {

    let c1 = {}; 
    Object.keys(this.corner1.slots).forEach(k => {
        c1[k] = this.corner1.slots[k];
    });
    let e = {};
    Object.keys(this.edge.slots).forEach(k => {
        e[k] = this.edge.slots[k];
    });
    let c2 = {}; 
    Object.keys(this.corner2.slots).forEach(k => {
        c2[k] = this.corner2.slots[k];
    });

    return {
        c1: c1,
        e: e,
        c2: c2,
    };
};

Side.prototype.assignMappings = function(m) {

    let c1 = {}; 
    Object.keys(this.corner1.slots).forEach(k => {
        c1[k] = this.corner1.slots[k];
    });
    let e = {};
    Object.keys(this.edge.slots).forEach(k => {
        e[k] = this.edge.slots[k];
    });
    let c2 = {}; 
    Object.keys(this.corner2.slots).forEach(k => {
        c2[k] = this.corner2.slots[k];
    });

    return {
        c1: c1,
        e: e,
        c2: c2,
    };
};

function buildSide(corner1, edge, corner2) {

    let c1 = corner1.split(",");
    let e = edge.split(",");
    let c2 = corner2.split(",");

    return new Side(
        new Corner(c1[0], c1[1], c1[2]), 
        new Edge(e[0], e[1]), 
        new Corner(c2[0], c2[1], c2[2]) 
    );
}

function Face(color, side1, side2, side3, side4) {

    Object.assign(this, {
        color: color,
        side1: side1,
        side2: side2,
        side3: side3,
        side4: side4,
    });
}

Face.prototype.getCorners = function() {

    let ret = []; 
    ret.push(this.side1.corner1);
    ret.push(this.side1.corner2);
    ret.push(this.side2.corner1);
    ret.push(this.side2.corner2);
    ret.push(this.side3.corner1);
    ret.push(this.side3.corner2);
    ret.push(this.side4.corner1);
    ret.push(this.side4.corner2);
    return ret;
};

Face.prototype.toString = function() {

    return `
Face ${this.color}
Side1: ${this.side1.toString()}
Side2: ${this.side2.toString()}
Side3: ${this.side3.toString()}
Side4: ${this.side4.toString()}`;
};

function Cube2(csv) {

    let parser = d3.dsvFormat("|");
    let data = parser.parse(csv);

    Object.assign(this, {faces: {}});

    this.corners = new Map();

    data.forEach(r => {
        let face = colorMap[r.face];
        let edge = colorMap[r.edge1.split(",")[1]];

        let side1 = buildSide(r.corner1, r.edge1, r.corner2);
        let side2 = buildSide(r.corner2, r.edge2, r.corner3);
        let side3 = buildSide(r.corner3, r.edge3, r.corner4);
        let side4 = buildSide(r.corner4, r.edge4, r.corner1);

        this.faces[face.value] = new Face(face.value, side1, side2, side3, side4);

        this.faces[face.value].getCorners().forEach(c => {
            this.corners.set(c.getKey(), c);
        });
    });

}

Cube2.prototype.toString = function() {

    let ret = "";
    Object.keys(this.faces).forEach(f => {
       ret += `${this.faces[f].toString()}\n` ;
    });

    return ret;
};

Cube2.prototype.rotate = function(face) {

    /*
    for each corner:
        skip the color that is not moving
        color1 = incoming.color1 //how do I know what incoming color to assign?
        color2 = incoming.color2
    find the slot 
    */

    const f = this.faces[face];

    const s1 = f.side1.getMappings();
    const s2 = f.side2.getMappings();
    const s3 = f.side3.getMappings();
    const s4 = f.side4.getMappings();

    f.side1.assignMappings(s4);
    f.side2.assignMappings(s1);
    f.side3.assignMappings(s2);
    f.side4.assignMappings(s3);

    console.log(f);

};

Cube2.prototype.getCorner = function(c) {
    return this.corners.get(makeKey(c));
};

module.exports = Cube2;