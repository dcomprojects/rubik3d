d3 = require("d3");

function drawCube(width, height, inData) {
    const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

    let dim = d3.min([width, height]);

    let inDatax = [
        "red", "green", "blue",
        "orange", "red", "red",
        "red", "white", "yellow",
    ];

    let data2 = [];
    let iter = inData.values();
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            let d = []; 
            d.push(x);
            d.push(y);
            d.push(iter.next().value);
            data2.push(d);
        }
    }

    let faceFn = (g) => {

        g.append("path")
        .attr("d", d => {
            let p = d3.path();
            p.rect(d[0] * dim/3.0, d[1] * dim/3.0, dim/3.0, dim/3.0);
            return p;
        }) 
        .attr("fill", d => d[2]);

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
        .data(data2)
        .join("g")
        .call(faceFn);

    return svg.node();
}

exports.drawCube = drawCube;