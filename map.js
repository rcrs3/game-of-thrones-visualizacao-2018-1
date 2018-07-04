const iconUrl = 'https://cdn.patricktriest.com/atlas-of-thrones/icons/';

this.map = L.map('mapid').setView([10, 30], 4);
        L.tileLayer(
          'https://cartocdn-gusc-b.global.ssl.fastly.net/ramirocartodb/api/v1/map/ramirocartodb@09b5df45@514b6ee6792b785b09469b931a2dd5b0:1529544224811/1,2,3,4,5,6,7,8,9,10,11/{z}/{x}/{y}.png',
          { crs: L.CRS.EPSG4326 }).addTo(this.map); 

var layers = {
  "kingdom": null,
  "castle": null,
  "city": null,
  "landmark": null,
  "region": null,
  "ruin": null,
  "town": null
}

function loadGeojson (layerType) {
  var whatShow = {
    "kingdom": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/kingdoms.geojson',
    "castle": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/castle.json',
    "city": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/city.json',
    "landmark": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/landmark.json',
    "region": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/region.json',
    "ruin": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/ruin.json',
    "town": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/town.json'
  };
  
  if(layers[layerType] !== null) {
  
    d3.select("body")
      .select("#" + layerType + "-toggle")
      .style("color", "grey");

    map.removeLayer(layers[layerType]);
    layers[layerType] = null;
  
  } else {
    
    d3.select("body")
      .select("#" + layerType + "-toggle")
      .style("color", "white");

    d3.json(whatShow[layerType], function(error, data) {
      layers[layerType] = L.geoJSON(data, {
        style: {
          'color': '#222',
          'weight': 1,
          'opacity': 1
        },
        pointToLayer: (feature, latlng) => {
          iconImage = iconUrl + layerType + ".svg";
          return L.marker(latlng, {
            icon: L.icon({ iconUrl: iconImage, iconSize: [ 24, 56 ] }),
            title: feature.properties.name })
        },
        onEachFeature: onEachFeature
      });
      
      layers[layerType].addTo(map);
    });

  }        
}

function onEachFeature(feature, layer) {
  if (feature.properties) {
      layer.bindPopup(JSON.stringify(feature.properties));
  }
}

var infoPanel = d3.select("body")
  .selectAll("#info-container")
  .select("div");

infoPanel.on("click", function(d, i) {
  var curClass = d3.select(this).attr("class");
  if(curClass === "info-container") {
    d3.select(this).attr("class", curClass + "info-active");
  } else {
    d3.select(this).attr("class", "info-container")
  }
});