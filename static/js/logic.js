const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


function markerSize(earthquakeData) {
    return earthquakeData *10;
}

function markerColor(earthquakeData) {
    if (earthquakeData < 1) {
        return "blue"
    }
    else if (earthquakeData < 2) {
        return "orange"
    }
    else if (earthquakeData < 3) {
        return "green"
    }
    else if (earthquakeData < 4) {
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
    // Give each feature a popup describing the place and time of the earthquake
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

    // function radiusSize(magnitude) {
    //     return magnitude * 2000;
    // }

    // function circleColors(magnitude) {
    //     if (magnitude < 1) {
    //         return "blue"
    //     }
    //     else if (magnitude < 2) {
    //         return "orange"
    //     }
    //     else if (magnitude < 3) {
    //         return "green"
    //     }
    //     else if (magnitude < 4) {
    //         return "red"
    //     }
    //     else {
    //         return "purple"
    //     }
        
    // }

    // const earthquake = L.geoJSON(earthquakeData, {
    //     pointToLayer: function(earthquakeData, latlng) {
    //         return L.circle(latlng, {
    //             radius: radiusSize(earthquakeData.properties.mag),
    //             color: circleColors(earthquakeData.properties.mag),
    //             fillOpacity: 1

    //         }); 
    //     },
    //     onEachFeature: onEachFeature

    // });
  
    // Sending our earthquakes layer to the createMap function
    
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

    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
  
        const div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];

        div.innerHTML+='Magnitude<br><hr>'
  
        // loop through our density intervals and generate a label with a colored square for each interval
        for (const i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
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

