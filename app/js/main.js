
const blah = require("./blah.js");

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
    const canvas = document.querySelectorAll( "#c" );

    blah.main(canvas[0], vs, fs);

    console.log(canvas);
});
