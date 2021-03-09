const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

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
  
    
    function radiusSize(magnitude) {
        return magnitude * 2000;
    }

    function circleColors(magnitude) {
        if (magnitude < 1) {
            return "blue"
        }
        else if (magnitude < 2) {
            return "orange"
        }
        else if (magnitude < 3) {
            return "green"
        }
        else if (magnitude < 4) {
            return "red"
        }
        else {
            return "purple"
        }
        
    }

    const earthquake = L.geoJSON(earthquakeData, {
        pointToLayer: function(earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: radiusSize(earthquakeData.properties.mag),
                color: circleColors(earthquakeData.properties.mag),
                fillOpacity: 1

            }); 
        },
        onEachFeature: onEachFeature

    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquake);
  }

function createMap(earthquake) {

    const myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5
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

    const light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    const  baseMaps = {
        Light: light
    };

    const overlayMaps = {
        Earthquakes: earthquake
    };

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    
}

const legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    
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

