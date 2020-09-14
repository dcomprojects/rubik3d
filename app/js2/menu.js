import {select} from "d3";

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


export {
    Menu
};