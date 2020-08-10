
import * as d3 from 'd3';

function buildData(inData) {
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

    return data2;
}

function drawCube(width, height, inData) {

    let dim = d3.min([width, height]) * 0.9;

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, dim, dim])
        .attr("height", dim);

    let cdim = (dim/3.0);


    let pieceGroup = svg.append("g")
        .selectAll("g")
        .data(buildData(inData))
        .join("g")
        .call(g => {

            g.append("path")
                .attr("d", d => {
                    let p = d3.path();
                    //p.rect(d[0] * dim / 3.0, d[1] * dim / 3.0, dim / 3.0, dim / 3.0);
                    p.rect(d[0] * cdim, d[1] * cdim, cdim, cdim);
                    return p;
                })
                .attr("fill", d => d[2]);

            g.append("line")
                .attr("stroke", "black")
                .attr("x1", d => d[0] * cdim)
                .attr("x2", d => (d[0] + 1) * cdim)
                .attr("y1", d => d[1] * cdim)
                .attr("y2", d => (d[1]) * cdim);

            g.append("line")
                .attr("stroke", "black")
                .attr("x1", d => d[0] * cdim)
                .attr("x2", d => (d[0]) * cdim)
                .attr("y1", d => d[1] * cdim)
                .attr("y2", d => (d[1] + 1) * cdim);

        });

    return Object.assign(svg.node(), {
        update: (data) => {
            pieceGroup.data(buildData(data))
            .select("path")
            .attr("fill", d => d[2]);
        }
    });
}

export {drawCube};