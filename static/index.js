// Variables

// SVG Variables
var width = 900.0;
var height = 440.0;
var margin; // dictionary
var map;
var graph;
var tooltip;
var lastSelected; //last selected country
var selected; //current selected country

// Data Variables
var population_link = "data/population.csv";
var map_link = "data/map.json";
var population = {}; // Population data
var map_data = {}; // Map paths
var combined_data = []; // Array of data of countries in both our data sets

// Timers
var choropleth;
var timer;

// Scales
var pop_reduce = d3.scaleLinear().domain([0, 2000000000]).range([0,2000]);
var color_scale = d3.scaleLinear().domain([0, 500]).range([1, 0]);
var x_scale = d3.scaleLinear().domain([1800, 2100]).range([0, 500]);
var y_scale = d3.scaleLinear().domain([0, 2000]).range([500, 0]);
var reduce = d3.scaleLinear().domain([0, 500000000]).range([0, 500]);

// OPEN DATA
d3.csv("data/population.csv", function(table) {
    // Format data here
    return table;
}).then(function(pop_data) {
    // Put stuff here

    // Format the population data
    pop_data.forEach(function(row) {
        population[row.name] = row;
    });

    // Draw countries
    // Initialize the data at 1800
    map = d3.select('body').append("svg").attr("width", width).attr("height", height);

    // Open the json file to get lines for countries
    d3.json("data/map.json", function(m) {
        return m;
    }).then(function(map_data) {

        // Format the map data
        var mapCoords = d3.entries(map_data.paths);
        mapCoords.forEach(function(row) {
            map_data[row.value.name] = row.value.path;
        });

        // Combined the data of the two maps
        var map_keys = Object.keys(map_data);
        pop_data.forEach(function(row) {
            // Only included the countries in both data sets
            if (map_keys.includes(row.name)) {
                combined_data.push({
                    'population' : row,
                    'path' : map_data[row.name]
                })
            }
        });

        // Create the map
        var countries = map
        .selectAll("path").data(combined_data).enter().append("path")
            .attr("id", function(d) {
                    return d.population.name; })
            .attr("d", function(d) { return d.path;} )
            .attr("stroke", "#f2f2f2")
            .attr("fill", "#f2f2f2")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("click", function() {
                // Make line graph visible


                // Highlight
                d3.select(this)
                    .attr("stroke-width", "3");

                // Zoom
                var bounds = this.getBBox();
                var x = bounds.x + bounds.width / 2;
                var y = bounds.y + bounds.height / 2;
                var extrax, extray;
                if (x > 500) {extrax = -250;}
                else {extrax = 250;}
                if (y > 200) {extray = -100;}
                else {extray = 100;}


                if (lastSelected != this) {
                    d3.select("body").select("svg").transition()
                    .duration(750)
                    .attr("transform", "translate(" + (width / 2 + -x + extrax) + "," + (height / 2 + -y + extray) + ")scale(" + 2 + ")");
                    d3.select(lastSelected)
                    .attr("stroke-width", "1");
                    lastSelected = this;
                    console.log("zoom in")

                    create_graph(this.__data__.population);
                    choropleth.stop();
                }
                else {
                    d3.select("body").select("svg").transition()
                    .duration(750)
                    .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + 1 + ")");
                    d3.select(lastSelected)
                    .attr("stroke-width", "1");
                    lastSelected = null;
                    console.log("zoom out")

                    // Create new graph
                    graph.remove();
                    timer.stop();
                    mapTimer();
                }
            }); // Close of click

    // Start the color
    mapTimer();

    // Create the tooltips for each country
    var tooltips = countries
    	.append("div")
    	.style("position", "absolute")
    	.style("z-index", "100")
    	.style("visibility", "hidden")
    	.style("background", "lightsteelblue")
    	.style("padding", "2px")
    	.style("border-radius", "10px")
        .text("STUFF");

        // console.log(tooltips);

    }); // Close of json (then)

    // Create a timeline (1800 - 2100)
    var label = d3.select("svg").append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("x", 350)
            .attr("y", 50)
            .text("PLACEHOLDER YEAR");

    // Add title

    data = [population['United States']]
    // TOOLTIP
    tooltip = d3.select("body")
    	.append("div")
    	.style("position", "absolute")
    	.style("z-index", "10")
    	.style("visibility", "hidden")
    	.style("background", "lightsteelblue")
    	.style("padding", "2px")
    	.style("border-radius", "10px")
    	.text("Population: ");


    // Transition
    var map_year = 1800;
    var mapTimer = function() {
        choropleth = d3.timer(function(elapsed) {
            map.selectAll("path").attr("fill", function(d) {
                return d3.interpolateSpectral(color_scale(reduce(d.population[map_year.toString()])));
            });

            // Label
            label.text(map_year);
            // Slider
            d3.select("#slider").attr("value", map_year.toString());
            d3.select("#slider_val").attr("value", map_year.toString()).text(map_year);

            if (map_year >= 2100) {
                choropleth.stop();
            } else {
                map_year = map_year + 1;
            }
        }, 100);
    }

    // Scatter plot of a country's population change
    var create_graph = function(graph_data) {
        if (graph) {
            graph.remove();
            timer.stop();
        }
        graph = d3.select("body")
                .append("svg")
                .attr("width", 560)
                .attr("height", 525)
                .style("position", "absolute")
                .style("z-index", "10")
                .style("border", "2px solid")
                .style("background", "lightsteelblue")
                .style("visibility", "visible");


        // X-axis
        graph.append("g").call(d3.axisBottom().scale(x_scale).ticks(5))
            .attr("transform", "translate(60, 500)");
        // X Label
        graph.append("g").append("text").text("Year")
            .attr("transform", "translate(250, 520)");

        // Y-axis
        graph.append("g").call(d3.axisLeft().scale(y_scale).ticks(5))
            .attr("transform", "translate(60, 0)");
        // Y Label
        graph.append("g").append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -320)
            .attr("y", 15)
            .text("Population (millions)");

        // Title
        graph.append("text").text("Population for the "+ graph_data['name'] + " from 1800-2100").attr("transform", "translate(200, 50)");


        // Plotting points
        year = 1800
        y_label = graph.append("text").text(year).attr("transform", "translate(200, 100)");
        timer = d3.interval(function(elapsed) {
            // Graphing the points
            point = graph.append("circle")
                .attr("cx", function(d) { return x_scale(year);})
                .attr("cy", function(d) { return y_scale(pop_reduce(graph_data[year.toString()]));})
                .attr("transform", "translate(60, 0)")
                .attr("r", 1)
                .attr("fill", "black");

            if (year == map_year) {
                point.attr("r", 3).attr("fill", "red");
            }
            // Change the year label
            y_label.text(year);

            if (year >= 2100) {
                timer.stop()
            } else {
                year = year + 1;
            }
        }, 5);
    }

    // Time buttons
    var reset = d3.select("#reset")
        .on('click', function() {
            map_year = 1800;
        })

    d3.select("#slider").on("change", function() {
      map_year = +this.value;
      label.text(map_year);
    });

    var pause = d3.select("#pause")
        .on('click', function() {
            choropleth.stop();
        })

    var start = d3.select("#resume")
        .on('click', function() {
            mapTimer();
        })

    // Mouse functions
    var mouseover = function() {
        // d3.select(this)
        console.log(this.__data__.population[map_year.toString()], map_year);
        tooltip.style("visibility", "visible");
    };

    var mousemove = function() {
        console.log("HERE");
        // d3.select(this).select("div")
        tooltip
        .text(this.__data__.population[map_year.toString()])
        .style("top", (event.pageY-10)+"px")
        .style("left",(event.pageX+10)+"px");
    };

    var mouseout = function() {
        // d3.select(this).select("div")
        tooltip
        .style("visibility", "hidden");
    };

});
