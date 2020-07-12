
const blah = require("./blah.js");
const somed3 = require("./somed3");

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

    window.globalShow = () => {
        console.log("Hello");
    };

    window.globalHide = () => {
        console.log("Hello Hide");
    };

    blah.main(canvas[0], vs, fs);

    const blueFace = document.querySelector(".faces .white");
    const svg = somed3.drawCube(blueFace.clientWidth, blueFace.clientHeight);
    blueFace.append(svg);

    console.log(canvas);
});
