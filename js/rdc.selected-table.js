/**
 * Created by robindecroon on 11/12/14.
 */
function SelectedTable(divID, title) {

    this.titleOffset = 15;

    this.width = widgetWidth - marginLeft - marginRight;
    this.height = widgetHeight - marginTop - marginBottom;// + nbBarsVariable * gap;

    this.internalChart = d3.select(divID)
        .append('table')
        .attr('class', 'patientTable')
        .attr('width', this.width + marginLeft + marginRight)
        .attr('height', this.height + marginTop + marginBottom);

    this.lowerLayer = this.internalChart.append("div")
        .attr("transform", translation(marginLeft, marginTop + this.titleOffset));
}

SelectedTable.prototype.update = function (data, columns) {


    var _this = this;

    _this.internalChart.select("table").remove();

    var table = _this.internalChart.append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");


    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(["Foto"].concat(columns))
        .enter()
        .append("th")
        .text(function (column) {
            return column;
        });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data);
    rows
        .enter()
        .append("tr");

    //rows.order();

    var images = rows.selectAll("td")
        .data(function (row) {
            return ["foto"].map(function (column) {
                if (row[gender] == "male") {
                    return {column: column, value: "http://api.randomuser.me/portraits/thumb/men/" + row["id"] + ".jpg"}
                } else if (row[gender] == "female") {
                    return {
                        column: column,
                        value: "http://api.randomuser.me/portraits/thumb/women/" + row["id"] + ".jpg"
                    }
                }
            });
        });

    images
        .enter()
        .append("img");

    images
        .attr('class', 'imageCell')
        .attr("src", function (d) {
            return d.value;
        });


    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function (row) {
            return columns.map(function (column) {
                return {column: column, value: row[column]};
            });
        });

    cells
        .enter()
        .append("td");

    cells
        .attr("style", "font-family: Courier") // sets the font style
        .attr("style", "max-width: 180px")
        .text(function (d) {
            return d.value;
        });

    cells
        .on("click", function () {
            Lightview.show({url: 'http://robindecroon.wordpress.com/', type: 'iframe'});
        });


    cells.exit().remove();

    rows.exit().remove();
};