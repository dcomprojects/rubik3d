const blah = require("./blah.js");
const somed3 = require("./somed3");
const Cube = require("./cube/cube5");
const parser = require('./cube/sequenceParser');
const d3 = require("d3");
const {
    svg
} = require("d3");

const vs = `
// an attribute will receive data from a buffer
attribute vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

const fs = `
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
}
`;

const onload = () => {
    return new Promise(function (resolve, reject) {
        window.onload = resolve;
    });
};

onload().then(() => {
    const canvas = document.querySelectorAll("#c");

    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // We listen to the resize event
    window.addEventListener('resize', () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    blah.main(canvas[0], vs, fs);

    d3.text("default3.csv").then((d) => {

        let cube = new Cube(d);

        let forward = (color) => {
            cube.rotate(color);
        };

        let reverse = (color) => {
            cube.rotateReverse(color);
        };

        let rotateFn = forward;

        window.addEventListener('keydown', (e) => {
            if (e.key === "Shift") {
                rotateFn = reverse;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === "Shift") {
                rotateFn = forward;
            }
        });

        let renderCube = () => {
            /*
            let scramble = parser.SequenceParser("B L2 B' D' U' L' D' L2 B D B F' L2 R U' B2 F' D R2 B F D2 L R' B' L' F2 D F D'");
            scramble(cube);
            */

            [
                "white", "red", "green",
                "blue", "yellow", "orange",
            ].forEach(color => {

                let faceColors = cube.getFaceColors(color);
                const face = document.querySelector(`.faces .${color}`);
                const svg = somed3.drawCube(face.clientWidth, face.clientHeight, faceColors);
                console.log(svg);
                face.append(svg);

            });

        };

        renderCube();

        let update = () => {
            [
                "white", "red", "green",
                "blue", "yellow", "orange",
            ].forEach(color => {

                let faceColors = cube.getFaceColors(color);
                const face = document.querySelector(`.faces .${color} > svg`);
                face.update(faceColors);

            });
        };

        let clickMap = {
            "white": ".up",
            "red": ".right",
            "green": ".front",
            "blue": ".back",
            "yellow": ".down",
            "orange": ".left",
        };

        Object.keys(clickMap).forEach(k => {
            let dir = clickMap[k];
            d3.select(`.directions ${dir}`)
                .on("click", (d, i, g) => {
                    rotateFn(k);
                    update();
                });
        });

    });
    console.log(canvas);
});