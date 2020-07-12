d3 = require("d3");

function drawCube(width, height) {
    const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

    let dim = d3.min([width, height]);

    let p1 = d3.path();
    p1.rect(0, 0, dim/3.0, dim/3.0);
    let p2 = d3.path();
    p2.rect(dim/3.0, 0, dim/3.0, dim/3.0);
    let p3 = d3.path();
    p3.rect(2 * dim/3.0, 0, dim/3.0, dim/3.0);

    let data = [
        [0, 0, "red"], [1, 0, "green"], [2, 0, "blue"],
        [0, 1, "orange"], [1, 1, "white"], [2, 1, "red"],
        [0, 2, "red"], [1, 2, "white"], [2, 2, "yellow"],
    ];

    let myfn = (d) => {
        let p = d3.path();
        p.rect(d[0] * dim/3.0, d[1] * dim/3.0, dim/3.0, dim/3.0);
        return p;
    };

    let fn = (g) => {

        g.append("line")
        .attr("stroke", "black")
        .attr("x1", d => d[0] * dim/3.0)
        .attr("x2", d => (d[0] + 1) * dim/3.0)
        .attr("y1", d => d[1] * dim/3.0)
        .attr("y2", d => (d[1]) * dim/3.0);

        g.append("line")
        .attr("stroke", "black")
        .attr("x1", d => d[0] * dim/3.0)
        .attr("x2", d => (d[0]) * dim/3.0)
        .attr("y1", d => d[1] * dim/3.0)
        .attr("y2", d => (d[1] + 1) * dim/3.0);

    };

    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .append("path")
        .attr("d", myfn) 
        .attr("fill", d => d[2]);

    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .call(fn);
        /*
        .append("line")
        .attr("stroke", "black")
        .attr("x1", d => d[0] * dim/3.0)
        .attr("x2", d => (d[0] + 1) * dim/3.0)
        .attr("y1", d => d[1] * dim/3.0)
        .attr("y2", d => (d[1]) * dim/3.0);
        */

    /*
    svg.append("g")
    .append("path")
    .attr("d", p1) 
    .attr("fill", "blue");

    svg.append("g")
    .append("path")
    .attr("d", p2) 
    .attr("fill", "red");

    svg.append("g")
    .append("path")
    .attr("d", p3) 
    .attr("fill", "yellow");
    */


    return svg.node();
}

exports.drawCube = drawCube;