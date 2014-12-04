// SET UP DIMENSIONS
var genderAgeWidth = widgetWidth - marginLeft - marginRight,
    genderAgeHeight = widgetHeight - marginTop - marginBottom,
    genderAgeGap = 0.5,
    genderAgeTickSize = 5;

// the width of each side of the chart
var regionWidth = genderAgeWidth / 2 - marginMiddle;

// these are the x-coordinates of the y-axes
var pointA = regionWidth,
    pointB = genderAgeWidth - regionWidth,
    titleOffset = 15;

var ageGroups = [];
function resetData() {
    ageGroups = [
        {group: '0-9', male: 0, female: 0},
        {group: '10-19', male: 0, female: 0},
        {group: '20-29', male: 0, female: 0},
        {group: '30-39', male: 0, female: 0},
        {group: '40-49', male: 0, female: 0},
        {group: '50-59', male: 0, female: 0},
        {group: '60-69', male: 0, female: 0},
        {group: '70-79', male: 0, female: 0},
        {group: '80-89', male: 0, female: 0},
        {group: '90-99', male: 0, female: 0},
        {group: '100-109', male: 0, female: 0},
        {group: '110-119', male: 0, female: 0}];
}
resetData();

// CREATE SVG
var genderAgeChart = d3.select("#genderpopulation").append('svg')
    .attr('width', marginLeft + genderAgeWidth + marginRight)
    .attr('height', marginTop + genderAgeHeight + marginBottom);

genderAgeChart.append("text")
    .attr("x", width / 2 + marginLeft)
    .attr("y", marginTop / 2 + titleOffset)
    .attr("text-anchor", "middle")
    .attr("class", "chart-title")
    .text("Bevolkingspiramide");

var genderAgelowerLayer = genderAgeChart.append('g')
    .attr('transform', translation(marginLeft, marginTop + titleOffset));

var genderAgemiddleLayer = genderAgeChart.append('g')
    .attr('transform', translation(marginLeft, marginTop + titleOffset));

var genderAgeUpperLayer = genderAgeChart.append('g')
    .attr('transform', translation(marginLeft, marginTop + titleOffset));

//var genderAgeLeftUpperLayer = genderAgeChart.append('g')
//    .attr('transform', translation(marginLeft, marginTop));
//
//var genderAgeRightUpperLayer = genderAgeChart.append('g')
//    .attr('transform', translation(marginLeft, marginTop));

ageGroupNames = ageGroups.map(function (d) {
    return d.group;
})

//var genderAgeBarHeight = (height / nbBars) - ((nbBars + 1) * gap + 2 * gap);


var yScale = d3.scale.ordinal()
    .domain(ageGroupNames)
    .rangeBands([genderAgeHeight, 0]);

genderAgelowerLayer.selectAll("text.axisText")
    .data(ageGroupNames)
    .enter().append("text")
    .attr('class', 'axisText')
    .attr("x", pointA + marginMiddle)
    .attr("y", function (d) {
        return yScale(d) + yScale.rangeBand() / 2;
    })
    .attr("dy", ".36em")
    .attr("text-anchor", "middle")
    .text(String);

function prepareData(data) {
    resetData();
    data.forEach(function (patient) {
        var groupID = Math.floor(patient.leeftijd / 10);
        if (patient.geslacht == 'male') {
            ageGroups[groupID].male++;
        } else {
            ageGroups[groupID].female++;
        }
    });

    // GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
    var totalPopulation = d3.sum(ageGroups, function (d) {
            return d.male + d.female;
        }),
        percentage = function (d) {
            return d / totalPopulation;
        };

    // find the maximum data value on either side
    //  since this will be shared by both of the x-axes
    var maxValue = Math.max(
        d3.max(ageGroups, function (d) {
            return percentage(d.male);
        }),
        d3.max(ageGroups, function (d) {
            return percentage(d.female);
        })
    );

// SET UP SCALES

// the xScale goes from 0 to the width of a region
//  it will be reversed for the left x-axis
    var xScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([0, regionWidth])
        .nice();

    var xAxisRight = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(genderAgeTickSize)
        //.tickSize(0)
        .tickFormat(d3.format('%'));

    var xAxisLeft = d3.svg.axis()
        // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
        .scale(xScale.copy().range([pointA, 0]))
        .orient('bottom')
        .ticks(genderAgeTickSize)
        //.tickSize(0)
        .tickFormat(d3.format('%'));

    //DRAW AXES

    genderAgemiddleLayer.select('.axis.x.left').remove();
    genderAgemiddleLayer.select('.axis.x.right').remove();

    genderAgemiddleLayer.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, genderAgeHeight))
        .call(xAxisLeft);

    genderAgemiddleLayer.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB, genderAgeHeight))
        .call(xAxisRight);

    genderAgemiddleLayer.selectAll("g.axis.x.left g.tick line")
        .attr("y2", -genderAgeHeight);

    genderAgemiddleLayer.selectAll("g.axis.x.right g.tick line")
        .attr("y2", -genderAgeHeight);

    // DRAW BARS
    var leftBars = genderAgelowerLayer.selectAll('.bar.left')
        .data(ageGroups);

    leftBars
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)')
        .attr('x', 0)
        .attr('height', yScale.rangeBand() - ageGroupNames.length * genderAgeGap);

    leftBars
        .transition().duration(transitionDuration)
        .attr('y', function (d) {
            return yScale(d.group) + genderAgeGap;
        })
        .attr('width', function (d) {
            return xScale(percentage(d.male));
        });

    leftBars.exit().remove();

    var rightBars = genderAgelowerLayer.selectAll('.bar.right')
        .data(ageGroups);

    rightBars
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('transform', translation(pointB, 0))
        .attr('x', 0)
        .attr('height', yScale.rangeBand() - ageGroupNames.length * genderAgeGap);

    rightBars
        .transition().duration(transitionDuration)
        .attr('y', function (d) {
            return yScale(d.group) + genderAgeGap;
        })
        .attr('width', function (d) {
            return xScale(percentage(d.female));
        });

    rightBars.exit().remove();

    var leftGenderAgeTextScores = genderAgeUpperLayer.selectAll("text.barTextR")
        .data(ageGroups);
    leftGenderAgeTextScores
        .enter().append("text");
    leftGenderAgeTextScores
        .transition().duration(transitionDuration)
        .attr("x", function (d) {
            return xScale(percentage(d.female)) + widgetWidth / 2 + marginMiddle;
        })
        .attr("y", function (d, i) {
            return yScale(d.group) + yScale.rangeBand() / 2 + genderAgeGap;
        })
        .attr("dx", -35)
        .attr("dy", 0)
        .attr("text-anchor", "end")
        .attr('class', 'barTextR')
        .text(function (d) {
            if (d.female != 0)
                return d3.format('%')(percentage(d.female));
        });
    leftGenderAgeTextScores.exit().remove();

    var rightGenderAgeTextScores = genderAgeUpperLayer.selectAll("text.barText")
        .data(ageGroups);
    rightGenderAgeTextScores
        .enter().append("text");
    rightGenderAgeTextScores
        .transition().duration(transitionDuration)
        .attr("x", function (d) {
            return widgetWidth / 2 - xScale(percentage(d.male)) - marginLeft - marginBottom;
        })
        .attr("y", function (d, i) {
            return yScale(d.group) + yScale.rangeBand() / 2 + genderAgeGap;
        })
        .attr("dx", +30)
        .attr("dy", 0)
        .attr("text-anchor", "end")
        .attr('class', 'barText')
        .text(function (d) {
            if (d.male != 0)
                return d3.format('%')(percentage(d.male));
        });
    rightGenderAgeTextScores.exit().remove();


}

// so sick of string concatenation for translations
function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
}