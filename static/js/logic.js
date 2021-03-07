const myMap = L.map("mapid", {
    center: [39.11, -94.62],
    zoom: 5
  });

  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(url, function(data) {
    console.log(data.features);
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: 0.5,
          weight: 1.5
        };
      }
    }).addTo(myMap);
  });

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

