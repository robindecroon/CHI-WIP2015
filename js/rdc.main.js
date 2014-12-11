var nbWidgetsHorizontal = 3;
var nbWidgetsVertical = 4;

var gridMargin = 20;

var marginTop = 20;
var marginRight = 30;
var marginBottom = 30;
var marginLeft = 30;
var marginMiddle = 22;

widgetWidth = window.innerWidth / nbWidgetsHorizontal - 1.5 * gridMargin;
widgetHeight = window.innerHeight / nbWidgetsVertical - 1.5 * gridMargin;

$(function () { //DOM Ready

    $(".gridster ul").gridster({
        widget_margins: [gridMargin / 2, gridMargin / 2],
        widget_base_dimensions: [widgetWidth, widgetHeight]
    }).gridster().data('gridster').disable();


});

$(window).resize(function () {

    window.location.href = window.location.href;

});