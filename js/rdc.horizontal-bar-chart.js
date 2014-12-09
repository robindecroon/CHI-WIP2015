function HorizontalChart(divID, title, valueType) {

    this.valueType = valueType;

    this.nbBarsVariable = 15;
    this.gap = 0.5;
    this.left_width = 150;
    this.titleOffset = 15;

    this.width = widgetWidth - marginLeft - marginRight;
    this.height = widgetHeight - marginTop - marginBottom;// + nbBarsVariable * gap;

    this.internalChart = d3.select(divID)
        .append('svg')
        .attr('width', this.width + marginLeft + marginRight)
        .attr('height', this.height + marginTop + marginBottom);

    this.internalChart.append("text")
        .attr("x", this.width / 2 + marginLeft)
        .attr("y", marginTop / 2 + this.titleOffset)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text(title);

    this.lowerLayer = this.internalChart.append("g")
        .attr("transform", translation(marginLeft, marginTop + this.titleOffset));

    this.middleLayer = this.internalChart.append("g")
        .attr("transform", translation(marginLeft, marginTop + this.titleOffset));

    this.upperLayer = this.internalChart.append("g")
        .attr("transform", translation(marginLeft, marginTop + this.titleOffset));
}

HorizontalChart.prototype.createChart = function (data) {

    var _this = this;

    var nbBars = _this.nbBarsVariable;

    var sortedData = data.sort(function (a, b) {
        return a[_this.valueType].localeCompare(b[_this.valueType]);
    });

    var a = [], b = [], prev;
    for (var i = 0; i < data.length; i++) {
        if (sortedData[i][_this.valueType] !== prev) {
            a.push(sortedData[i][_this.valueType]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = sortedData[i][_this.valueType];
    }
    var chartDict = [];
    for (var i = 0; i < a.length; i++) {
        chartDict.push({
            key: a[i],
            value: +b[i]
        });
    }

    chartDict.sort(function (a, b) {
        return b.value - a.value;
    });
    nbBars = d3.min([nbBars, chartDict.length]);
    chartDict = chartDict.slice(0, nbBars);

    //calculate height
    var barHeight = (_this.height / nbBars) - ((nbBars + 1) * _this.gap + 2 * _this.gap);

    var x = d3.scale.linear()
        .domain([0, d3.max(chartDict, function (d) {
            return d.value;
        })])
        .range([0, _this.width - _this.left_width]);

    var yValues = [];
    chartDict.forEach(function (d) {
        yValues.push(d.key);
    });

    var y = d3.scale.ordinal()
        .domain(yValues)
        .rangeBands([0, _this.height]);


    var lines = _this.upperLayer.selectAll("line")
        .data(x.ticks(d3.max(chartDict, function (d) {
            return d.value;
        })));
    lines
        .enter().append("line");
    lines
        .transition().duration(transitionDuration)
        .attr("class", "axisHelpLines")
        .attr("x1", function (d) {
            return x(d) + _this.left_width;
        })
        .attr("x2", function (d) {
            return x(d) + _this.left_width;
        })
        .attr("y1", 0)
        .attr("y2", _this.height);
    lines.exit().remove();

    var textNames = _this.lowerLayer.selectAll("text.axisText")
        .data(chartDict);
    textNames
        .enter().append("text");
    textNames
        .attr('class', 'axisText')
        .transition().duration(transitionDuration)
        .attr("x", 0)
        .attr("y", function (d) {
            return y(d.key) + y.rangeBand() / 2 - 2 * _this.gap;
        })
        .attr("dy", ".36em")
        .attr("text-anchor", "left")
        .text(function (d) {
            var text = d.key;
            return text.slice(0, 30);
        });
    textNames.exit().remove();

    var bars = _this.middleLayer.selectAll("rect")
        .data(chartDict);
    bars
        .enter().append("rect");

    bars
        .transition().duration(transitionDuration)
        .attr("class", "bar")
        .attr("x", this.left_width)
        .attr("y", function (d) {
            return y(d.key) + _this.gap;
        })
        .attr("width", function (d) {
            return x(d.value);
        })
        .attr("height", barHeight)
        .style("fill", function (d) {
            if (d.selected == true)
                return "red"
            else
                return "steelblue"
        });
    bars.exit().remove();

    bars
        .on("click", function (d) {
            //var filterData = $.grep(window.data, function (n, i) {
            //    return n[_this.valueType] == d.key;
            //});
            chartDict.forEach(function (n) {
                if (n[_this.valueType] == d.key)
                    n.selected = true;
            });
            updateWidgets(filterData)
        });

    var textScores = _this.middleLayer.selectAll("text.barText")
        .data(chartDict);
    textScores
        .enter().append("text");
    textScores
        .transition().duration(transitionDuration)
        .attr("x", function (d) {
            return x(d.value) + _this.left_width;
        })
        .attr("y", function (d, i) {
            return y(d.key) + y.rangeBand() / 2;
        })
        .attr("dx", -5)
        .attr("dy", 0)
        .attr("text-anchor", "end")
        .attr('class', 'barText')
        .text(function (d) {
            return d.value;
        });
    textScores.exit().remove();
};