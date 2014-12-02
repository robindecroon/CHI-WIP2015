var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = window.innerWidth/2 - margin.left - margin.right,
    height = window.innerHeight/3 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select("#demographics")
    .append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function update(data) {
    x.domain(data.map(function (d) {
        return d.name;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.gewicht;
    })]);

    chart.select(".x.axis").remove(); // << this line added
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.select(".y.axis").remove(); // << this line added
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var bar = chart.selectAll(".bar")
        .data(data, function (d) {
            return d.name;
        });

    // new data:
    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.name);
        })
        .attr("y", function (d) {
            return y(d.gewicht);
        })
        .attr("height", function (d) {
            return height - y(d.gewicht);
        })
        .attr("width", x.rangeBand());
    // removed data:
    bar.exit().remove();
    //// updated data:
    bar
        .transition().duration(transitionDuration)
        .attr("y", function (d) {
            return y(d.gewicht);
        })
        .attr("x", function (d) {
            return x(d.name);
        })
        .attr("width", x.rangeBand())
        .attr("height", function (d) {
            return height - y(d.gewicht);
        });

}