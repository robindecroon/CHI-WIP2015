transitionDuration = 100;

// this section uses underscore.js and underscore.math
var pcz;

// color scale for zscores
var zcolorscale = d3.scale.linear()
    .domain([-2, -0.5, 0.5, 2])
    .range(["#fc8d59", "#91cf60", "#91cf60", "#fc8d59"])
    .interpolate(d3.interpolateLab);


var icpcChart = new HorizontalChart("#icpc", "Meest voorkomende aandoeningen");
var genderAgeChart = new DoubleHorizontalBarChart("#genderpopulation", "Bevolkingspiramide", "leeftijd", "geslacht");
var religionChart = new HorizontalChart("#religion", "Religie");
var degreeChart = new HorizontalChart("#degree", "Hoogste diploma");
var physicianChart = new HorizontalChart("#physician", "Hoofdverzorger");
//var marriedGauge =  new Gauge("#gauge", 67, 0, 100, "Getrouwd");

var g = new JustGage({
    id: "gauge",
    value: 67,
    min: 0,
    max: 100,
    title: "Visitors"
});

var nbDays = '#dagen sinds bezoek';
var income = 'inkomen'
var bloodHigh = 'systolische bloeddruk';
var bloodLow = 'diastolische bloeddruk';
var weight = 'gewicht';
var sugar = 'glycemie';
var age = 'leeftijd';

var religion = 'religie';
var icpc = 'icpc';
var degree = 'diploma';
var careGiver = 'hoofddokter';
var gender = 'geslacht';

var patientsByGender;

var myDimensions = [nbDays, income, bloodHigh, bloodLow, weight, sugar, age];
var myQualitativeDimensions = [religion, icpc, degree, careGiver];

var crossFilterDimensions = [];

// load csv file and create the chart
d3.csv('data/testdata.csv', function (data) {
    var patients = crossfilter(data);

    patientsByGender = patients.dimension(function (d) {
        return d[gender];
    })

    myDimensions.forEach(function (dim) {
        var tempDim = patients.dimension(function (d) {
            return +d[dim];
        });
        var temp = {key: dim, crossDim: tempDim};
        crossFilterDimensions.push(temp);
    });

    myQualitativeDimensions.forEach(function (dim) {
        var tempDim = patients.dimension(function (d) {
            return d[dim];
        });
        var temp = {key: dim, crossDim: tempDim};
        crossFilterDimensions.push(temp);
    });

    updateWidgets(data);
    drawParCoords(data);
});

function drawParCoords(data) {
    pcz = d3.parcoords()("#patient_filter")
        .data(data)
        .margin({
            top: marginTop * 2,
            left: marginLeft,
            right: marginRight,
            bottom: marginBottom
        })
        .render()
        .dimensions(myDimensions)
        .render()
        .createAxes()
        .alpha(0.9)
        .reorderable()
        .shadows()
        .brushMode("1D-axes")  // enable brushing
        .on("brush", function (items) {
            updateWidgets(items);
        });

    change_color("systolische bloeddruk");

    // click label to activate coloring
    pcz.svg.selectAll(".dimension")
        .on("click", change_color)
        .selectAll(".label")
        .style("font-size", "14px");
}


function updateWidgets() {
    var filtered = window.filtered;
    if (filtered) {
        crossFilterDimensions.forEach(function (dimension) {
            var found = false;
            var low;
            var high;
            filtered.forEach(function (f) {
                if (f.dimension == dimension.key) {
                    found = true;
                    low = f.lower;
                    high = f.high;
                }
            });
            if (found) {
                dimension.crossDim.filter([low, high])
            } else {
                dimension.crossDim.filter(null);
            }

        });
    }

    // create the charts
    for (var i = 0; i < crossFilterDimensions.length; i++) {
        var crossDimension = crossFilterDimensions[i].crossDim;
        switch (crossFilterDimensions[i].key) {
            case icpc:
                icpcChart.createChart(crossDimension);
                break;
            case religion:
                religionChart.createChart(crossDimension);
                break;
            case degree:
                degreeChart.createChart(crossDimension);
                break;
            case careGiver:
                physicianChart.createChart(crossDimension);
                break;
            case age:
                genderAgeChart.prepareData(crossDimension, patientsByGender);


        }
    }
    var filteredData = crossFilterDimensions[0].crossDim.top(Infinity);
    createHeatmap(filteredData);
    //genderAgeChart.prepareData(filteredData, "leeftijd", "geslacht");
    window.filtered = undefined;
}

// update color
function change_color(dimension) {
    pcz.svg.selectAll(".dimension")
        .style("font-weight", "normal")
        .filter(function (d) {
            return d == dimension;
        })
        .style("font-weight", "bold");

    pcz.color(zcolor(pcz.data(), dimension)).render()
}

// return color function based on plot and dimension
function zcolor(col, dimension) {
    var z = zscore(_(col).pluck(dimension).map(parseFloat));
    return function (d) {
        return zcolorscale(z(d[dimension]))
    }
}

// color by zscore
function zscore(col) {
    var n = col.length,
        mean = _(col).mean(),
        sigma = _(col).stdDeviation();
    return function (d) {
        return (d - mean) / sigma;
    };
}