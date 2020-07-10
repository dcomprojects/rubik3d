/* eslint no-console:0 consistent-return:0 */
"use strict";

// L' D2 B2 D2 U2 R2 U' L R' B U L' D2 U' F U R B' D' L2 R U F D B D L B F U2
const dirToColorMap = {
    "L": "orange",
    "D": "yellow",
    "B": "blue",
    "U": "white",
    "R": "red",
    "F": "green"
};

function SequenceParser(seq) {

    let rotate = (cube, face) => {
        cube.rotate(face);
    };

    let rotatePrime = (cube, face) => {
        cube.rotateReverse(face);
    };

    let moves = [];
    seq.split(" ").forEach(t => {


        let dir, mod;
        [dir, mod] = t.split("");

        if (mod === "2") {

            moves.push({
                "color": dirToColorMap[dir],
                "fn": rotate
            });
            moves.push({
                "color": dirToColorMap[dir],
                "fn": rotate
            });

        } else if (mod === "'") {
            moves.push({
                "color": dirToColorMap[dir],
                "fn": rotatePrime
            });
        } else {
            moves.push({
                "color": dirToColorMap[dir],
                "fn": rotate
            });
        }

    });
    return (cube) => {
        moves.forEach(m => {
            m.fn(cube, m.color);
        });
    };

}

exports.SequenceParser = SequenceParser;