
import {event, select} from 'd3';
import {createSVG} from './createSVG';

const colors = [
            "white", "red", "green",
            "blue", "yellow", "orange",
];

let update = (cube) => {
        colors.forEach(color => {
            let faceColors = cube.getFaceColors(color);
            const face = document.querySelector(`.faces .${color} > svg`);
            face.update(faceColors);
        });
};

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

    let updatex = () => {
        colors.forEach(color => {
            let faceColors = cube.getFaceColors(color);
            const face = document.querySelector(`.faces .${color} > svg`);
            face.update(faceColors);
        });
    };

    const dirs = [
            "up", "right", "front",
            "down", "left", "back",
    ];

    dirs.forEach(dir => {
        select(`.faces .f_${dir}`)
            .on("touchstart", function(d, i, g) {
                event.preventDefault();
                colors.forEach(c => {
                    if (select(g[i]).classed(c)) {
                        rotateFn(c);
                    }
                });
                update(cube);
            })
            .on("click", function(d, i, g) {
                colors.forEach(c => {
                    console.log(g[i]);
                    if (select(g[i]).classed(c)) {
                        rotateFn(c);
                    }
                });
                update(cube);
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

    buildSVGs(orientation);
};

function CubeHandler2d (cube) {
    this.cube = cube;
    this.currentOrienation = {};
}

CubeHandler2d.prototype.render = function(orientation) {
    render(this.cube, orientation);
};

CubeHandler2d.prototype.setFaces = function(orientation) {

    let changed = false;
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

    update(this.cube);
};

export {
    CubeHandler2d
};