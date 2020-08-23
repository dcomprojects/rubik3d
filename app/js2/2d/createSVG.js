
import * as d3 from 'd3';

function prepareData(inData) {
    let ret = [];
    let iter = inData.values();
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            ret.push({
                "x": x,
                "y": y,
                "color": iter.next().value,
            });
        }
    }

    return ret;
}

function createSVG(width, height, inData) {

    let dim = d3.min([width, height]) * 0.9;

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, dim, dim])
        .attr("height", dim);

    let cdim = (dim/3.0);

    let pieceGroup = svg.append("g")
        .selectAll("g")
        .data(prepareData(inData))
        .join("g")
        .call(g => {

            g.append("path")
                .attr("d", d => {
                    let p = d3.path();
                    p.rect(d.x * cdim, d.y * cdim, cdim, cdim);
                    return p;
                })
                .attr("fill", d => d.color);

            g.append("line")
                .attr("stroke", "black")
                .attr("x1", d => d.x * cdim)
                .attr("x2", d => (d.x + 1) * cdim)
                .attr("y1", d => d.y * cdim)
                .attr("y2", d => d.y * cdim);

            g.append("line")
                .attr("stroke", "black")
                .attr("x1", d => d.x * cdim)
                .attr("x2", d => d.x * cdim)
                .attr("y1", d => d.y * cdim)
                .attr("y2", d => (d.y + 1) * cdim);

        });

    return Object.assign(svg.node(), {
        update: (data) => {
            pieceGroup.data(prepareData(data))
            .select("path")
            .attr("fill", d => d.color);
        }
    });
}

export {createSVG};