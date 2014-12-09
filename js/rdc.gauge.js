/**
 * Created by robindecroon on 05/12/14.
 */
function Gauge(divID, value, min, max, title) {

    var g = new JustGage({
        id: divID.slice(1, divID.length),
        value: value,
        min: min,
        max: max,
        title: title
    });
}