/* eslint no-console:0 consistent-return:0 */
"use strict";
const face = require("./face");

function init() {

    let red = face.init("red");
    let green = face.init("green");
    let blue = face.init("blue");
    let white = face.init("white");
    let orange = face.init("orange");
    let yellow = face.init("yellow");

    const cube = {

        x_axis: [red, orange],
        y_axis: [green, blue],
        z_axis: [yellow, white],

        orientation: {
            up: white,
            front: green,
            right: red,
            back: blue,
            down: yellow,
            left: orange
        }
    };

    return cube;
}

function Cube() {
    console.log("blah!");
    Object.assign(this, init());
}


Cube.prototype.rotate = function (direction) {

    console.log(this);

    let s0 = this.orientation[direction].side[0];
    let s1 = this.orientation[direction].side[1];
    let s2 = this.orientation[direction].side[2];
    let s3 = this.orientation[direction].side[3];

    this.orientation[direction].side[0] = s3;
    this.orientation[direction].side[1] = s0;
    this.orientation[direction].side[2] = s1;
    this.orientation[direction].side[3] = s2;

};

module.exports = Cube;