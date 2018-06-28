const kingdom = 'https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/kingdoms.geojson';

this.map = L.map('mapid').setView([10, 30], 4);
        L.tileLayer(
          'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png',
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