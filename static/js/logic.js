const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


function markerSize(data) {
    return data *10;
}

function markerColor(data) {
    if (data < 1) {
        return "blue"
    }
    else if (data < 2) {
        return "orange"
    }
    else if (data < 3) {
        return "green"
    }
    else if (data < 4) {
        return "red"
    }
    else {
        return "purple"
    }

}

d3.json(url, function(data) {
    createFeatures(data.features);
    console.log(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place, time and magnitude of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  

    function marker(feature, location) {
        const mark = {
            stroke: false,
            radius: markerSize(feature.properties.mag),
            color: markerColor(feature.properties.mag)
        }

        return L.circleMarker(location, mark);
    }

    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: marker
    });

    createMap(earthquakes);

}

function createMap(earthquakes) {

    const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

    
    // Adding tile layer to the map
    // L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    //     tileSize: 512,
    //     maxZoom: 18,
    //     zoomOffset: -1,
    //     id: "mapbox/streets-v11",
    //     accessToken: API_KEY
    // }).addTo(myMap);


    const  baseMaps = {
        "Street Map": streetmap
    };

    const overlayMaps = {
        Earthquakes: earthquakes
    };

    const myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]

    });

    function getColor(d) {
        return d > 5 ? '#ff3333' :
                d > 4  ? '#ff6633' :
                d > 3  ? '#ff9933' :
                d > 2  ? '#ffcc33' :
                d > 1  ? '#ffff33' :
                         '#ccff33';
    }

    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
  
        const div = L.DomUtil.create('div', 'info legend'),
        intervals = [0, 1, 2, 3, 4, 5],
        labels = [];
  
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < intervals.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(intervals[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                intervals[i] + (intervals[i + 1] ? '&ndash;' + intervals[i + 1] + '<br>' : '+');
        }
  
        return div;
    };
  
  legend.addTo(myMap);

  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
    


// d3.json(url, function(response) {
//     const markers = L.markerClusterGroup();

//     for (const i = 0; i < response.length; i++) {
//         const location = response[i].location;
//         console.log(location.coordinates[0]);

//         if (location) {
//             markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
//                 .bindPopup(response[i].descriptor));
//         }
//     }

//     myMap.addLayer(markers);
// });

