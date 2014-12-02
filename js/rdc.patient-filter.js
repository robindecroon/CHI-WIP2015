transitionDuration = 100;
gridMargin = 20;


// this section uses underscore.js and underscore.math
var pcz;

// color scale for zscores
var zcolorscale = d3.scale.linear()
    .domain([-2,-0.5,0.5,2])
    .range(["#fc8d59", "#91cf60", "#91cf60", "#fc8d59"])
    .interpolate(d3.interpolateLab);

// load csv file and create the chart
d3.csv('data/testdata.csv', function(data) {
    createHeatmap(data);
    update(data);
    prepareData(data);
    pcz = d3.parcoords()("#patient_filter")
        .data(data)
        .render()
        .dimensions(['systolische bloeddruk','diastolische bloeddruk','gewicht','glycemie','leeftijd','#dagen sinds laatste bezoek'])
        .render()
        .createAxes()
        .alpha(0.9)
        .reorderable()
        .shadows()
        .brushMode("1D-axes")  // enable brushing
        .on("brush", function(items) {
            update(items);
            prepareData(items);
            createHeatmap(items);
        });

    change_color("systolische bloeddruk");

    // click label to activate coloring
    pcz.svg.selectAll(".dimension")
        .on("click", change_color)
        .selectAll(".label")
        .style("font-size", "14px");

});

//pcz.innerWidth(window.innerWidth);

// update color 
function change_color(dimension) {
    pcz.svg.selectAll(".dimension")
        .style("font-weight", "normal")
        .filter(function(d) { return d == dimension; })
        .style("font-weight", "bold");

    pcz.color(zcolor(pcz.data(),dimension)).render()
}

// return color function based on plot and dimension
function zcolor(col, dimension) {
    var z = zscore(_(col).pluck(dimension).map(parseFloat));
    return function(d) { return zcolorscale(z(d[dimension])) }
}

// color by zscore
function zscore(col) {
    var n = col.length,
        mean = _(col).mean(),
        sigma = _(col).stdDeviation();
    return function(d) {
        return (d-mean)/sigma;
    };
}