// nb of bars
var nbBarsVariable = 15;
var gap = 0.5;

// lengte van de namen
var left_width = 150;

var width = widgetWidth - marginLeft - marginRight,
    height = widgetHeight - marginTop - marginBottom;// + nbBarsVariable * gap;

var icpcChart = d3.select("#icpc")
    .append('svg')
    //.attr('class', 'chart')
    .attr('width', width + marginLeft + marginRight)
    .attr('height', height + marginTop + marginBottom);

var lowerLayer = icpcChart.append("g")
    .attr("transform", translation(marginLeft, marginTop + 6));

var middleLayer = icpcChart.append("g")
    .attr("transform", translation(marginLeft, marginTop + 6));

var upperLayer = icpcChart.append("g")
    .attr("transform", translation(marginLeft, marginTop + 6));

function icpc(data) {

    var nbBars = nbBarsVariable;

    // count icpc occurences
    var sortedData = data.sort(function (a, b) {
        return a.icpc.localeCompare(b.icpc);
    });

    var a = [], b = [], prev;
    for (var i = 0; i < data.length; i++) {
        if (sortedData[i].icpc !== prev) {
            a.push(sortedData[i].icpc);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = sortedData[i].icpc;
    }
    var icpcDict = [];
    for (var i = 0; i < a.length; i++) {
        icpcDict.push({
            key: a[i],
            value: +b[i]
        });
    }

    icpcDict.sort(function (a, b) {
        return b.value - a.value;
    });
    nbBars = d3.min([nbBars, icpcDict.length]);
    icpcDict = icpcDict.slice(0, nbBars);

    //calculate height
    var barHeight = (height / nbBars) - ((nbBars + 1) * gap + 2 * gap);

    var x = d3.scale.linear()
        .domain([0, d3.max(icpcDict, function (d) {
            return d.value;
        })])
        .range([0, width - left_width]);

    var yValues = [];
    icpcDict.forEach(function (d) {
        yValues.push(d.key);
    });
    var y = d3.scale.ordinal()
        .domain(yValues)
        .rangeBands([0, height]);

    var lines = upperLayer.selectAll("line")
        .data(x.ticks(d3.max(icpcDict, function (d) {
            return d.value;
        })));
    lines
        .enter().append("line");
    lines
        .transition().duration(transitionDuration)
        .attr("class", "axisHelpLines")
        .attr("x1", function (d) {
            return x(d) + left_width;
        })
        .attr("x2", function (d) {
            return x(d) + left_width;
        })
        .attr("y1", 0)
        .attr("y2", height);
    lines.exit().remove();

    var rules = lowerLayer.selectAll(".rule")
        .data(x.ticks(d3.max(icpcDict, function (d) {
            return d.value;
        })));
    rules
        .enter().append("text");
    rules
        .transition().duration(transitionDuration)
        .attr("class", "axisText")
        .attr("x", function (d) {
            return x(d) + left_width;
        })
        .attr("y", 0)
        .attr("dy", -6)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .text(String);
    rules.exit().remove();

    var textNames = lowerLayer.selectAll("text.axisText")
        .data(icpcDict);
    textNames
        .enter().append("text");
    textNames
        .attr('class', 'axisText')
        .transition().duration(transitionDuration)
        .attr("x", 0)
        .attr("y", function (d) {
            return y(d.key) + y.rangeBand() / 2 - 2 * gap;
        })
        .attr("dy", ".36em")
        .attr("text-anchor", "left")
        .text(function (d) {
            var text = d.key;
            return text.slice(0, 30);
        });
    textNames.exit().remove();

    var bars = middleLayer.selectAll("rect")
        .data(icpcDict);
    bars
        .enter().append("rect");
    bars
        .transition().duration(transitionDuration)
        .attr("class", "bar")
        .attr("x", left_width)
        .attr("y", function (d) {
            return y(d.key) + gap;
        })
        .attr("width", function (d) {
            return x(d.value);
        })
        .attr("height", barHeight);
    bars.exit().remove();

    var textScores = middleLayer.selectAll("text.barText")
        .data(icpcDict);
    textScores
        .enter().append("text");
    textScores
        .transition().duration(transitionDuration)
        .attr("x", function (d) {
            return x(d.value) + left_width;
        })
        .attr("y", function (d, i) {
            return y(d.key) + y.rangeBand() / 2;
        })
        .attr("dx", -10)
        .attr("dy", 0)
        .attr("text-anchor", "end")
        .attr('class', 'barText')
        .text(function (d) {
            return d.value;
        });
    textScores.exit().remove();
}