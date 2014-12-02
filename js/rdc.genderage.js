// SET UP DIMENSIONS
var w = widgetWidth - marginLeft - marginRight,
    h = widgetHeight - marginTop - marginBottom;

// the width of each side of the chart
var regionWidth = w / 2 - marginMiddle;

// these are the x-coordinates of the y-axes
var pointA = regionWidth,
    pointB = w - regionWidth;

// some contrived data
var exampleData;
resetData();

function resetData() {
    exampleData = [
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
        {group: '110-119', male: 0, female: 0}
    ];
}

// CREATE SVG
var svg = d3.select("#genderpopulation").append('svg')
    .attr('width', marginLeft + w + marginRight)
    .attr('height', marginTop + h + marginBottom)
    // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
    .append('g')
    .attr('transform', translation(marginLeft, marginTop));

var yScale = d3.scale.ordinal()
    .domain(exampleData.map(function (d) {
        return d.group;
    }))
    .rangeRoundBands([h, 0], 0.1);

// SET UP AXES
var yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4, 0)
    .tickPadding(marginMiddle - 4);

var yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4, 0)
    .tickFormat('');

svg.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle');

svg.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight);

function prepareData(data) {
    resetData();
    data.forEach(function (patient) {
        var groupID = Math.floor(patient.leeftijd / 10);
        if (patient.geslacht == 'male') {
            exampleData[groupID].male++;
        } else {
            exampleData[groupID].female++;
        }
    });

    // GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
    var totalPopulation = d3.sum(exampleData, function (d) {
            return d.male + d.female;
        }),
        percentage = function (d) {
            return d / totalPopulation;
        };

    // find the maximum data value on either side
    //  since this will be shared by both of the x-axes
    var maxValue = Math.max(
        d3.max(exampleData, function (d) {
            return percentage(d.male);
        }),
        d3.max(exampleData, function (d) {
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
    //
    //var xScaleLeft = d3.scale.linear()
    //    .domain([0, maxValue])
    //    .range([regionWidth, 0]);
    //
    //var xScaleRight = d3.scale.linear()
    //    .domain([0, maxValue])
    //    .range([0, regionWidth]);

    var xAxisRight = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(d3.format('%'));

    var xAxisLeft = d3.svg.axis()
        // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
        .scale(xScale.copy().range([pointA, 0]))
        .orient('bottom')
        .tickFormat(d3.format('%'));

    // DRAW AXES

    svg.select('.axis.x.left').remove();
    svg.select('.axis.x.right').remove();

    svg.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, h))
        .call(xAxisLeft);

    svg.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB, h))
        .call(xAxisRight);

    // DRAW BARS
    var leftBars = svg.selectAll('.bar.left')
        .data(exampleData);

    leftBars
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)')
        .attr('x', 0)
        .attr('height', yScale.rangeBand());

    leftBars
        .transition().duration(transitionDuration)
        .attr('y', function (d) {
            return yScale(d.group);
        })
        .attr('width', function (d) {
            return xScale(percentage(d.male));
        });

    leftBars.exit().remove();

    var rightBars = svg.selectAll('.bar.right')
        .data(exampleData);

    rightBars
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('transform', translation(pointB, 0))
        .attr('x', 0)
        .attr('height', yScale.rangeBand());

    rightBars
        .transition().duration(transitionDuration)
        .attr('y', function (d) {
            return yScale(d.group);
        })
        .attr('width', function (d) {
            return xScale(percentage(d.female));
        });

    rightBars.exit().remove();

}

// so sick of string concatenation for translations
function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
}