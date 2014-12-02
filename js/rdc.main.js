var nbWidgetsHorizontal = 2;
var nbWidgetsVertical = 3;

var gridMargin = 20;

var marginTop = 20;
var marginRight = 30;
var marginBottom = 30;
var marginLeft = 30;
var marginMiddle = 28;

widgetWidth = window.innerWidth / nbWidgetsHorizontal - 2 * gridMargin;
widgetHeight = window.innerHeight / nbWidgetsVertical - 2 * gridMargin;

$(function () { //DOM Ready

    $(".gridster ul").gridster({
        widget_margins: [gridMargin / 2, gridMargin / 2],
        widget_base_dimensions: [widgetWidth, widgetHeight]
    });

    //$(".gridster ul").gridster(options).width("auto");


});

$(window).resize(function () {

    window.location.href = window.location.href;

});