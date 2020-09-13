import {select} from "d3";

function Menu(attribs) {

    let dropDownVisible = false; 

    select("#menu")
    .on("click", function() {

        let hiding = dropDownVisible;
        dropDownVisible = !dropDownVisible;

        if (!hiding) {
            select(".dropdown-content")
            .classed("show", dropDownVisible);
        }

        let right = dropDownVisible ? "0px" : "-100px";
        select(".dropdown-content")
        .style("right", right);

    });

    select(".dropdown-content")
    .on("transitionend", function(d) {
        select(this).classed("show", dropDownVisible);
    })
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