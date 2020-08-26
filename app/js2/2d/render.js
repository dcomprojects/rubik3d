
import {event, select} from 'd3';
import {createSVG} from './createSVG';

const colors = [
            "white", "red", "green",
            "blue", "yellow", "orange",
];

let update = (cube, orientation) => {

    Object.keys(orientation).forEach(dir => {

        const faceColors = cube.getFaceColors(orientation[dir]);
        const face = document.querySelector(`.faces .f_${dir} > svg`);
        face.update(faceColors);

    });

};

const render = (cube, orientationFn) => {

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

    const dirs = [
            "up", "right", "front",
            "down", "left", "back",
    ];

    dirs.forEach(dir => {
        select(`.faces .f_${dir}`)
            .on("touchstart", function(d, i, g) {
                event.preventDefault();

                const orientation = orientationFn();
                Object.keys(orientation).forEach(dir => {
                    if (select(g[i]).classed(`f_${dir}`)) {
                        rotateFn(orientation[dir]);
                    }
                });

                update(cube, orientation);
            })
            .on("click", function(d, i, g) {

                const orientation = orientationFn();
                Object.keys(orientation).forEach(dir => {
                    if (select(g[i]).classed(`f_${dir}`)) {
                        rotateFn(orientation[dir]);
                    }
                });
                update(cube, orientation);
            });
    });

    let buildSVGs = (orientation) => {

        /*
        let scramble = parser.SequenceParser("B L2 B' D' U' L' D' L2 B D B F' L2 R U' B2 F' D R2 B F D2 L R' B' L' F2 D F D'");
        scramble(cube);
        */

        Object.keys(orientation).forEach(dir => {

            let color = orientation[dir];
            let faceColors = cube.getFaceColors(color);

            const face = select(`.faces .f_${dir}`).classed(color, true);
            const svg = createSVG(face.node().clientWidth, face.node().clientHeight, faceColors);
            face.node().append(svg);
        });
    };

    buildSVGs(orientationFn());
};

function CubeHandler2d (cube) {
    this.cube = cube;
    this.currentOrienation = {};
}

CubeHandler2d.prototype.render = function(orientationFn) {
    render(this.cube, orientationFn);
};

CubeHandler2d.prototype.setFaces = function(orientationFn) {

    let changed = false;

    const orientation = orientationFn();

    Object.keys(orientation).forEach((dir) => {

        if (this.currentOrienation[dir] !== orientation[dir]) {
            changed = true;
        }

    });

    if (!changed) {
        return;
    }
    this.currentOrienation = orientation;

    Object.keys(orientation).forEach(dir => {
        const color = orientation[dir];
        select(`.faces .${color}`)
            .classed(`${color}`, false);
    });

    Object.keys(orientation).forEach(dir => {
        const color = orientation[dir];
        const face = select(`.faces .f_${dir}`).classed(color, true);
    });

    update(this.cube, orientation);
};

export {
    CubeHandler2d
};