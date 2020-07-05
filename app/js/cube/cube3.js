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

function Corner(vec) {
    let dir = glm.vec4.create();

    glm.vec3.add(dir,
        colorMap[vec[0]].direction,
        colorMap[vec[1]].direction);

    glm.vec3.add(dir,
        dir,
        colorMap[vec[2]].direction);

    let location = glm.vec3.clone(dir);

    Object.assign(this, {
        x: vec[0],
        y: vec[1],
        z: vec[2],
        key: vec.join(""),
        //direction: glm.vec3.normalize(dir, dir),
        direction: dir, 
        location: glm.vec3.clone(dir)
    });
}

Corner.prototype.toString = function() {
   let ret = "";
    ["x", "y", "z"].forEach(s => {
        ret += `${s} -> ${colorMap[this[s]].value}
${this.direction}        
${this.location}        
`;
    });
    return ret;
};

Corner.prototype.cache = function(cube) {
    cube.pieces[this.key] = this;
};

function Edge(vec) {
     let dir = glm.vec4.create();

    glm.vec3.add(dir, 
        colorMap[vec[0]].direction,
        colorMap[vec[1]].direction);

    glm.vec3.add(dir, 
        dir, 
        colorMap[vec[2]].direction);

    //glm.vec3.normalize(dir, dir);

   Object.assign(this, {
        x: vec[0],
        y: vec[1],
        z: vec[2],
        key: vec.join(""),
        //direction: glm.vec3.normalize(dir, dir),
        direction: dir, 
        location: glm.vec3.clone(dir)
    });
}

Edge.prototype.toString = function() {
   let ret = "";
    ["x", "y", "z"].forEach(s => {
        ret += `${s} -> ${colorMap[this[s]].value}
${this.direction}        
${this.location}
`;
    });
    return ret;
};

Edge.prototype.cache = function(cube) {
    cube.pieces[this.key] = this;
};

function Face(vec) {
      let dir = glm.vec4.create();

    glm.vec3.add(dir, 
        colorMap[vec[0]].direction,
        colorMap[vec[1]].direction);

    glm.vec3.add(dir, 
        dir, 
        colorMap[vec[2]].direction);

    //glm.vec3.normalize(dir, dir);

  Object.assign(this, {
        x: vec[0],
        y: vec[1],
        z: vec[2],
        key: vec.join(""),
        //direction: glm.vec3.normalize(dir, dir),
        direction: dir, 
        location: glm.vec3.clone(dir)
    });
}

Face.prototype.toString = function() {
   let ret = "";
    ["x", "y", "z"].forEach(s => {
        ret += `${s} -> ${colorMap[this[s]].value}
${this.direction}        
${this.location}
`;
    });
    return ret;
};

Face.prototype.cache = function(cube) {
    cube.pieces[this.key] = this;
};

function Center(vec) {

    let dir = glm.vec4.create();

    glm.vec3.add(dir, 
        colorMap[vec[0]].direction,
        colorMap[vec[1]].direction);

    glm.vec3.add(dir, 
        dir, 
        colorMap[vec[2]].direction);

    //glm.vec3.normalize(dir, dir);

    Object.assign(this, {
        x: vec[0],
        y: vec[1],
        z: vec[2],
        key: vec.join(""),
        //direction: glm.vec3.normalize(dir, dir),
        direction: dir, 
        location: glm.vec3.clone(dir)
    });

}

Center.prototype.toString = function() {
   let ret = "";
    ["x", "y", "z"].forEach(s => {
        ret += `${s} -> ${colorMap[this[s]].value}
${this.direction}        
${this.location}
`;
    });
    return ret;
};
Center.prototype.cache = function(cube) {
    cube.pieces[this.key] = this;
};

let colorMap2 = {
    o: -1,
    g: -1,
    w: 1,
    r: 1,
    y: -1,
    b: 1,
    '#': 0
};

function createCorner(vec) {
    return new Corner(vec);
}

function createEdge(vec) {
    return new Edge(vec);
}

function createFace(vec) {
    return new Face(vec);
}

function createCenter(vec) {
    return new Center(vec);
}

function getIndex(s) {
    let vec = [];
    let i = 0;
    s.split(",").map(c => {
        i += colorMap2[c] === 0 ? 0 : 1;
        vec.push(c);
    });

    if (i === 3) {
        return createCorner(vec);
    }

    if (i === 2) {
        return createEdge(vec);
    }

    if (i === 1) {
        return createFace(vec);
    }

    return createCenter(vec);
};

function Cube3(csv) {

    let parser = d3.dsvFormat("|");
    let data = parser.parse(csv);

    let cube = [
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
    ];

    this.pieces = {};

    data.forEach(r => {
        let v = getIndex(r["data"]);
        v.cache(this);
        cube[+r.x][+r.y][+r.z] = v;
    });

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                //console.log(`(${x} ${y} ${z}): ${cube[x][y][z].toString()}`);
            }
        }
    }

}

Cube3.prototype.toString = function() {

    let ret = "";
    Object.keys(this.faces).forEach(f => {
       ret += `${this.faces[f].toString()}\n` ;
    });

    return ret;
};

Cube3.prototype.rotate = function(face) {

    this.getFacePieces(face).forEach(p => {
        let m1 = glm.mat4.fromTranslation(glm.mat4.create(), glm.vec3.scale(glm.vec3.create(), FACES[face].direction, -1));
        let r1 = ROTATIONS[face]; 
        let m2 = glm.mat4.fromTranslation(glm.mat4.create(), FACES[face].direction);

        glm.mat4.multiply(r1, r1, m1);
        glm.mat4.multiply(m2, m2, r1);

        glm.vec4.transformMat4(p.direction, p.direction, m2);
    });
};

Cube3.prototype.getCorner = function(c) {
    return this.pieces[c];
};

Cube3.prototype.getFacePieces = function(face) {

    let dir = FACES[face].direction;

    let ret = [];
    Object.keys(this.pieces).forEach(p => {
        let dot = glm.vec3.dot(dir, this.pieces[p].direction);
        if (dot - 1e-7 > 0) {
            ret.push(this.pieces[p]);
        }
    });
    return ret;
};

module.exports = Cube3;