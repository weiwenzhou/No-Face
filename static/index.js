// Variables
var data_link;

// SVG Variables
var WIDTH;
var HEIGHT;
var margin; // dictionary
var lastSelected; //last selected country
var centered;

// OPEN DATA
d3.csv("data/population.csv", function(table) {
    // Format data here
    // console.log(table);
    // if (table.name == "United States") {
    return table;
    // }
}).then(function(pop_data) {
    // Put stuff here
    // console.log(data[0]);
    // Data contains only US population data currently
    // console.log(pop_data)

    // Format the population data
    population = {};
    pop_data.forEach(function(row) {
        population[row.name] = row;
    })

    // console.log(population);

    data = [population['United States']];
    // console.log(data);


    // SCALE POPULATION to display an appropriate amount of people
    var p_scale;

    // Draw countries?
    // Initialize the data at 1800
    var map = d3.select('body').append("svg").attr("width", 900.0).attr("height", 440.7063107441331).style("border", "1px solid");

    // Open the json file to get lines for countries
    d3.json("data/map.json", function(error, m) {
        // console.log(m);
        // alert(error);
        return m
    }).then(function(map_data) {
        // console.log(map_data)
        // console.log(map_data.paths);

        var mapCoords = d3.entries(map_data.paths);

        // console.log(mapCoords)


        map_parse = {};
        mapCoords.forEach(function(row) {
            // console.log(row.value.path);
            map_parse[row.value.name] = row.value.path;
        })


        // console.log(map_parse)
        // console.log(Object.keys(map_parse));


        var map_keys = Object.keys(map_parse);
        combined_data = [];
        pop_data.forEach(function(row) {
            if (map_keys.includes(row.name)) {
                console.log("GOOG");
                combined_data.push({
                    'population' : row,
                    'path' : map_parse[row.name]
                })
            }
        })
        // console.log(combined_data);

        var countries = map.selectAll("path").data(combined_data).enter().append("path")
                        .attr("id", function(d) {
                                // console.log(d.value.name);
                                return d.population.name; })
                        .attr("d", function(d) { return d.path;} )
                        .attr("stroke", "#f2f2f2")
                        .attr("fill", "#f2f2f2")
                        .on("mouseover", mouseover)
                        .on("click", function() {
                          d3.select(this)
                            .attr("stroke-width", "3");
                          console.log("Country selected");
                          if (lastSelected != this) {
                            d3.select(lastSelected)
                              .attr("stroke-width", "1");
                          }
                          lastSelected = this;
                        })
    });
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


    // Plotting points + animation of map (temp)
    var pop_reduce = d3.scaleLinear().domain([0, 2000000000]).range(0,500);
    var color_scale = d3.scaleLinear().domain([0, 500]).range([1, 0]);
    var year = 1800
    var y_label = graph.append("text").text(year).attr("transform", "translate(200, 100)");
    var timer = d3.interval(function(elapsed) {
        graph.append("circle")
            .attr("cx", function(d) { return x_scale(year);})
            .attr("cy", function(d) { return y_scale(reduce(data[0][year.toString()]));})
            .attr("transform", "translate(60, 0)")
            .attr("r", 1)
            .attr("fill", function(d) {
                                return d3.interpolateGreens(color_scale(pop_reduce(data[0][year.toString()])));
                                });
        y_label.text(year);

        map.selectAll("path").attr("fill", function(d) {
            return d3.interpolateSpectral(color_scale(reduce(d.population[year.toString()])));
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);



        d3.select("#US")
            .attr("style", "fill-rule:evenodd")
            .attr("fill", function(d) {
                return d3.interpolateGreens(color_scale(reduce(data[0][year.toString()])));
            });
        // console.log(1,year.toString(),2);
        if (year >= 2100) {
            timer.stop()
        } else {
            year = year + 1;
        }
    }, 10);

    //TEMP TOOLTIP
    var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.style("background", "lightsteelblue")
	.style("padding", "2px")
	.style("border-radius", "10px")
	.text("Population: " + data[0][year.toString()]);

    d3.select("#US")
	.on("mouseover", function(){return tooltip.style("visibility", "visible");})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");})

    var mouseover = function() {
        console.log(this.__data__.population[year.toString()], year);
        tooltip.style("visibility", "visible");
    };

    var mousemove = function() {
        tooltip.text(this.__data__.population[year.toString()])
        .style("top", (event.pageY-10)+"px")
        .style("left",(event.pageX+10)+"px");
    };

    var mouseout = function() {
        tooltip.style("visibility", "hidden");
    };

});
