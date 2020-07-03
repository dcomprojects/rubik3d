function Corner(c1, c2, c3) {
    Object.assign(this, {
        colors: [c1, c2, c3]
    });
}

function Edge(c1, c2) {
    Object.assign(this, {
        colors: [c1, c2]
    });
}

function Side(corner1, edge, corner2) {
    Object.assign(this, {
        corner1: corner1,
        edge: edge,
        corner2: corner2
    });
}

function Face(color, corner1, edge1, corner2, edge2, corner3, edge3, corner4, edge4) {

    Object.assign(this, {
        color: color,
        corner1: {p: corner1, 
            white: WHITE
        }, 
    });
}

let corners = {
    ogw: {},
    rgw: {},
    rbw: {},
    obw: {},

    ogy: {},
    rgy: {},
    rby: {},
    oby: {},
};

let edges = {
    by: {},
    oy: {},
    gy: {},
    ry: {},

    rb: {},
    ob: {},
    og: {},
    rg: {},

    wb: {},
    wo: {},
    wg: {},
    wr: {},
};

let WHITE = 0;
let GREEN = 1;
let RED = 2;
let BLUE = 3;
let ORANGE = 4;
let YELLOW = 5;

function buildWhiteFace(cornerFn, edgeFn) {
    new Face(
        WHITE,
        //white-green
        [{p: cornerFn(WHITE, RED, GREEN), o: {
            white: WHITE,
            red: RED,
            green: GREEN,
        }},
        {p: edgeFn(WHITE, GREEN), o: { 
            white: WHITE,
            green: GREEN,
        }},
        {p: cornerFn(WHITE, GREEN, ORANGE), o: {
            white: WHITE,
            green: GREEN,
            orange: ORANGE,
        }}],

        //white-orange
        [{p: cornerFn(WHITE, ORANGE, GREEN), o: {
            white: WHITE,
            orange: ORANGE,
            green: GREEN
        }},
        {p: edgeFn(WHITE, ORANGE), o: {
            white: WHITE,
            orange: ORANGE
        }},
        {p: cornerFn(WHITE, BLUE, ORANGE), o: {
            white: WHITE,
            blue: BLUE,
            orange: ORANGE,
        }}],

        //white-blue
        [{p: cornerFn(WHITE, BLUE, ORANGE), o: {
            white: WHITE,
            blue: BLUE,
            orange: ORANGE,
        }},
        {p: edgeFn(WHITE, BLUE), o: {
            white: WHITE,
            blue: BLUE,
        }},
        {p: cornerFn(WHITE, BLUE, RED), o: {
            white: WHITE,
            blue: BLUE,
            red: RED,
        }}],

        //white-red
        [{p: cornerFn(WHITE, BLUE, RED), o: {
            white: WHITE,
            blue: BLUE,
            red: RED,
        }},
        {p: edgeFn(WHITE, RED), o: {
            white: WHITE,
            red: RED,
        }},
        {p: cornerFn(WHITE, RED, GREEN), o: {
            white: WHITE,
            red: RED,
            green: GREEN,
        }}]
    );
}

function Cube2() {

    let cornerCache = new Map();
    let edgeCache = new Map();

    function getCorner(c1, c2, c3) {

        let s = new Set([c1, c2, c3]);

        let c = cornerCache.get(s);

        if (!c) {
            c = new Corner(c1, c2, c3);
            cornerCache.set(s, c);
        }

        return c;
    }

    function getEdge(c1, c2) {

        let s = new Set([c1, c2]);

        let e = edgeCache.get(s);

        if (!e) {
            e = new Edge(c1, c2);
            edgeCache.set(s, e);
        }

        return e;
    }

    Object.assign(this, {edges: edges});
    Object.assign(this, {corners: corners});
    Object.assign(this, {faces: {}});

    console.log(this);

    this.faces.white = buildWhiteFace(getCorner, getEdge);
    this.faces.green = buildGreenFace(getCorner, getEdge);
    this.faces.red = buildRedFace(getCorner, getEdge);
    this.faces.blue = buildBlueFace(getCorner, getEdge);
    this.faces.orange = buildOrangeFace(getCorner, getEdge);
    this.faces.yellow = buildYellowFace(getCorner, getEdge);

    this.corners.ogw = {
        p: getCorner(ORANGE, GREEN, WHITE),
        orange: ORANGE,
        green: GREEN,
        white: WHITE,
    };

    this.corners.rgw = {
        p: getCorner(RED, GREEN, WHITE),
        red: RED,
        green: GREEN,
        white: WHITE,
    };

    this.corners.rbw = {
        p: getCorner(RED, BLUE, WHITE),
        red: RED,
        blue: BLUE,
        white: WHITE,
    };

    this.corners.obw = {
        p: getCorner(ORANGE, BLUE, WHITE),
        orange: ORANGE,
        blue: BLUE,
        white: WHITE,
    };

    this.faces.white = [
        this.corners.obw,
        this.corners.rbw,
        this.corners.rgw,
        this.corners.ogw,
    ];

}

Cube2.prototype.rotate = function(face) {

};

module.exports = Cube2;