var heatmap;

// map center
var myLatlng = new google.maps.LatLng(50.868580, 4.538670);
// map options,
var myOptions = {
    zoom: 8,
    center: myLatlng
};
// standard map
var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
// heatmap layer
heatmap = new HeatmapOverlay(map,
    {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": 0.1,
        "maxOpacity": 0.7,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
    }
);
//};

function createHeatmap(items) {
    var data = {max: 5, data: items};
    heatmap.setData(data);
}