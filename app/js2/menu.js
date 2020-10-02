import {select, format} from "d3";

function Menu(attribs) {

    let dropDownVisible = false; 

    select("#menu")
    .on("click", function() {

        dropDownVisible = !dropDownVisible;
        let right = dropDownVisible ? "0px" : "-100px";
        select(".dropdown-content")
        .style("right", right);

    });

    select(".dropdown-content")
    .selectAll("a")
    .data(attribs.links)
    .join("a")
    .attr("href", "#")
    .on("click", function(d) {
        d.fn(this);
    })
    .text(d => d.text);
}

let updateFrontFaceAngle = (info) => {

    var f = format(".2f");
    
    let data = [];
    ["x", "y", "z"].map(l => {
        data.push({"label": l, "value": f(info[l])});
    });

    ["red", "green", "blue", "white", "yellow", "orange"].map(l => {
        data.push({"label": l, "value": `${f(info[l].x)}, ${f(info[l].y)}, ${f(info[l].z)}`});
    });

    select("#info")
    .selectAll("p")
    .data(data)
    .join("p")
    .text(d => `${d.label}: ${d.value}`);

};


export {
    Menu,
    updateFrontFaceAngle
};