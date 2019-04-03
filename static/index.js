// Variables
var data_link;

// SVG Variables
var WIDTH;
var HEIGHT;
var margin; // dictionary

// OPEN DATA
d3.csv("data/population.csv", function(table) {
    // Format data here
    // console.log(table);
    if (table.name == "United States") {
        return table
    }
}).then(function(data) {
    // Put stuff here
    console.log(data[0]);
    // Data contains only US population data currently

    // SCALE POPULATION to display an appropriate amount of people
    var p_scale;

    // Draw countries?
    // Initialize the data at 1800
    var label = d3.select("#US").selectAll("text").data(data).enter().append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "40px")
            .attr("x", 100)
            .attr("y", 100)
            .text("year");
    console.log(label);

    // Create a timeline (1800 - 2100)
    var label = d3.select("svg").append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "40px")
            .attr("x", 200)
            .attr("y", 100)
            .text("PLACEHOLDER YEAR");

    // Add title


    // Transition


    // Temp Line graph
    var graph = d3.select("body").append("svg").attr("width", 560).attr("height", 525).style("border", "2px solid");

    var x_scale = d3.scaleLinear().domain([1800, 2100]).range([0, 500]);
    var y_scale = d3.scaleLinear().domain([0, 500]).range([500, 0]);
    var reduce = d3.scaleLinear().domain([0, 500000000]).range([0, 500]);

    // X-axis
    graph.append("g").call(d3.axisBottom().scale(x_scale).ticks(5))
        .attr("transform", "translate(60, 500)");
    // X Label
    graph.append("text").text("Year")
        .attr("transform", "translate(250, 520)");

    // Y-axis
    graph.append("g").call(d3.axisLeft().scale(y_scale).ticks(5))
        .attr("transform", "translate(60, 0)");
    // Y Label
    graph.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -320)
        .attr("y", 15)
        .text("Population (millions)");

    // Title
    graph.append("text").text("Population for the U.S. from 1800-2100").attr("transform", "translate(200, 50)");
    // Plotting points
    dlist = d3.entries(data[0]);
    console.log(dlist);

    // graph.selectAll("circle").data(dlist).enter().append("circle")
    //     .attr("cx", function(d) { return x_scale(d.key);})
    //     .attr("cy", function(d) { return y_scale(reduce(d.value));})
    //     .attr("transform", "translate(60, 0)")
    //     .attr("r", 1)
    //     .attr("fill", "black");

    var year = 1800
    var y_label = graph.append("text").text(year).attr("transform", "translate(200, 100)");
    var timer = d3.interval(function(elapsed) {
        graph.append("circle")
            .attr("cx", function(d) { return x_scale(year);})
            .attr("cy", function(d) { return y_scale(reduce(data[0][year.toString()]));})
            .attr("transform", "translate(60, 0)")
            .attr("r", 1)
            .attr("fill", "black");
        y_label.text(year);
        year = year + 1;
        // console.log(1,year.toString(),2);
        if (year > 2100) {
            timer.stop()
        }
    }, 200);

});
