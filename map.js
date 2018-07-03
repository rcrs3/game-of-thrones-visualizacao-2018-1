const kingdom = 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/kingdoms.geojson';

this.map = L.map('mapid').setView([10, 30], 4);
        L.tileLayer(
          'https://cartocdn-gusc-d.global.ssl.fastly.net/ramirocartodb/api/v1/map/ramirocartodb@09b5df45@1891dec87191be4cadc288f181fae4be:1529544224811/1,2,3,4,5,6,7,8,9,10,11/{z}/{x}/{y}.png',
          { crs: L.CRS.EPSG4326 }).addTo(this.map); 

function loadGeojson (button) {
  var whatShow = {
    "kingdom": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/kingdoms.geojson',
    "castle": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/castle.json',
    "city": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/city.json',
    "landmark": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/landmark.json',
    "region": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/region.json',
    "ruin": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/ruin.json',
    "town": 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/town.json'
  };

  
  d3.json(whatShow[button], function(error, data) {
    L.geoJSON(data, {
      onEachFeature: onEachFeature
    }).addTo(this.map);
  });        
}

function onEachFeature(feature, layer) {
  if (feature.properties) {
      layer.bindPopup(JSON.stringify(feature.properties));
  }
}
