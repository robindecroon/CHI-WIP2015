var nbWidgetsHorizontal = 2;
var nbWidgetsVertical = 3;

var gridMargin = 20;

var marginTop = 20;
var marginRight = 30;
var marginBottom = 30;
var marginLeft = 30;
var marginMiddle = 22;

widgetWidth = window.innerWidth / nbWidgetsHorizontal - nbWidgetsHorizontal * gridMargin;
widgetHeight = window.innerHeight / nbWidgetsVertical - nbWidgetsHorizontal * gridMargin;

$(function () { //DOM Ready

    $(".gridster ul").gridster({
        widget_margins: [gridMargin / 2, gridMargin / 2],
        widget_base_dimensions: [widgetWidth, widgetHeight]
    }).gridster().data('gridster').disable();


});

$(window).resize(function () {

    window.location.href = window.location.href;

});