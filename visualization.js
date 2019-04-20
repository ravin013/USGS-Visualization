var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson" 

console.log(url)

// Perform a GET request to the query URL
d3.json(url, function(data) {

  createFeatures(data.features);
});
  
    function createFeatures(earthquakeData) {

      var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "<h4> Magnitude = " + feature.properties.mag +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" );
        
}, 
pointToLayer: function (feature, latlng) {
  return new L.circle(latlng,
    {radius: markerSize(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      fillOpacity: .7,
      color: "#000",
      stroke: true,
      weight: .5
  })

}
});

  createMap(earthquakes);
    }



function createMap(earthquakes) {

    var streetmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: API_KEY
  });
   // Define a baseMaps object to hold our base layers
   var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Create legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

            div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;


};

legend.addTo(myMap);

}




function getColor(d) {
  return d > 5 ? '#F30' :
  d > 4  ? '#F60' :
  d > 3  ? '#F90' :
  d > 2  ? '#FC0' :
  d > 1   ? '#FF0' :
            '#9F3';
}

function markerSize(magnitude) {
  return magnitude * 20000;
}


