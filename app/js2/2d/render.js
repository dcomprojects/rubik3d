
import {event, select} from 'd3';
import {drawCube} from './somed3';

const render = (cube, orientation) => {

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

    document.querySelectorAll(".invert").forEach(d => {

        d.addEventListener("touchstart", (ev) => {
            rotateFn = reverse;
        }, false);

        d.addEventListener("touchend", (ev) => {
            rotateFn = forward;
        }, false);

        d.addEventListener("touchcancel", (ev) => {
            rotateFn = forward;
        }, false);

    });
    /*
    el.addEventListener("touchmove", (ev) => {
        ev.preventDefault();
    }, false);
    */


    let renderCube = (orientation) => {
        /*
        let scramble = parser.SequenceParser("B L2 B' D' U' L' D' L2 B D B F' L2 R U' B2 F' D R2 B F D2 L R' B' L' F2 D F D'");
        scramble(cube);
        */

        /*
        [
            "white", "red", "green",
            "blue", "yellow", "orange",
        ]
        */

        const svgs = {};

        Object.keys(orientation)
        .forEach(dir => {

            let color = orientation[dir];
            let faceColors = cube.getFaceColors(color);

            const face = select(`.faces .f_${dir}`).classed(color, true);
            const svg = drawCube(face.node().clientWidth, face.node().clientHeight, faceColors);
            face.node().append(svg);
            svgs[color] = svg;

        });

        return svgs;
    };

    let svgs = renderCube(orientation);

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
        select(`.faces .${k}`)
            .on("touchstart", (d, i, g) => {
                event.preventDefault();
                rotateFn(k);
                update();
            })
            .on("click", (d, i, g) => {
                rotateFn(k);
                update();
            });
    });

    return svgs;
};

function CubeHandler2d (cube) {
    this.cube = cube;
}

CubeHandler2d.prototype.render = function(orientation) {
    this.svgs = render(this.cube, orientation);
};

CubeHandler2d.prototype.setFaces = function(orientation) {

    Object.keys(orientation).forEach(dir => {
        const color = orientation[dir];
        select(`.faces .${color}`)
            .classed(`.${color}`, false)
            .select("svg")
            .remove();
    });

    Object.keys(orientation).forEach(dir => {
        const color = orientation[dir];
        const face = select(`.faces .f_${dir}`).classed(color, true);
        const svg = this.svgs[color];
        face.node().append(svg);
    });

};

export {
    CubeHandler2d
};