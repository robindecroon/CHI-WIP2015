transitionDuration = 100;

// this section uses underscore.js and underscore.math
var pcz;

// color scale for zscores
var zcolorscale = d3.scale.linear()
    .domain([-2,-0.5,0.5,2])
    .range(["#fc8d59", "#91cf60", "#91cf60", "#fc8d59"])
    .interpolate(d3.interpolateLab);


var icpcChart = new HorizontalChart("#icpc", "Meest voorkomende aandoeningen", "icpc");
var genderAgeChart = new DoubleHorizontalBarChart("#genderpopulation", "Bevolkingspiramide");
var religionChart = new HorizontalChart("#religion", "Religie", "religie");
var degreeChart = new HorizontalChart("#degree", "Hoogste diploma", "diploma");
var physicianChart = new HorizontalChart("#physician", "Hoofdverzorger", "hoofddokter");
//var marriedGauge =  new Gauge("#gauge", 67, 0, 100, "Getrouwd");

var g = new JustGage({
    id: "gauge",
    value: 67,
    min: 0,
    max: 100,
    title: "Visitors"
});

// load csv file and create the chart
d3.csv('data/testdata.csv', function(data) {
    updateWidgets(data);
    pcz = d3.parcoords()("#patient_filter")
        .data(data)
        .margin({
            top: marginTop * 2,
            left: marginLeft,
            right: marginRight,
            bottom: marginBottom
        })
        .render()
        .dimensions(['#dagen sinds bezoek', 'inkomen', 'systolische bloeddruk', 'diastolische bloeddruk', 'gewicht', 'glycemie', 'leeftijd'])
        .render()
        .createAxes()
        .alpha(0.9)
        .reorderable()
        .shadows()
        .brushMode("1D-axes")  // enable brushing
        .on("brush", function(items) {
            updateWidgets(items)
        });

    change_color("systolische bloeddruk");

    // click label to activate coloring
    pcz.svg.selectAll(".dimension")
        .on("click", change_color)
        .selectAll(".label")
        .style("font-size", "14px");

});

function updateWidgets(items) {
    var crossData = crossfilter(items)
    window.data = crossData;
    createHeatmap(items);
    genderAgeChart.prepareData(items, "leeftijd", "geslacht");
    icpcChart.createChart(items);
    religionChart.createChart(items);
    degreeChart.createChart(items);
    physicianChart.createChart(items);
}

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