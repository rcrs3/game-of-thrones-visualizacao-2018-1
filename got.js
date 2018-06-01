var epi
var allCharacters = []
corrMatrix = []
charQuant = 50

// to convert scene start/end times into seconds
function toSecs(timeString){
  var sec = 0;
  if (timeString.length == 0) return sec;
  var splitArray = timeString.split(":");
  sec = 3600*parseFloat(splitArray[0])+60*parseFloat(splitArray[1])+parseFloat(splitArray[2]);
  return sec;
}

function compareTime(a,b) {
  if (a.screenTime < b.screenTime)
     return 1;
  if (a.screenTime > b.screenTime)
    return -1;
  return 0;
}


d3.json("https://raw.githubusercontent.com/jeffreylancaster/game-of-thrones/master/data/episodes.json", function(json) {
  epi = json.episodes
  for (var i = 0; i < epi.length; i++) {
    epiScenes = epi[i].scenes
    for (var j = 0; j < epiScenes.length; j++) {
      scenesChars = epiScenes[j].characters
      for (var k = 0; k < scenesChars.length; k++) {

        found = 0
        for (var l = 0; l < allCharacters.length; l++) {
          if(scenesChars[k].name == allCharacters[l].name){
            found = 1
            allCharacters[l].screenTime += (toSecs(epiScenes[j].sceneEnd) - toSecs(epiScenes[j].sceneStart))
          }
        }

        if (found==0) {
          var chara = {name:scenesChars[k].name, screenTime:(toSecs(epiScenes[j].sceneEnd) - toSecs(epiScenes[j].sceneStart))};
          allCharacters.push(chara)
        }
      }
    }
  }
  allCharacters = allCharacters.sort(compareTime)

  for (var a = 0; a < charQuant; a++) {
    var arr = []
    arr.length = charQuant;
    arr.fill(0)
    corrMatrix.push(arr)
    for (var b = 0; b < charQuant; b++) {
      for (var i = 0; i < epi.length; i++) {
        epiScenes = epi[i].scenes
        for (var j = 0; j < epiScenes.length; j++) {
          scenesChars = epiScenes[j].characters

          for (var k = 0; k < scenesChars.length; k++) {
            if(scenesChars[k].name == allCharacters[a].name){
              for (var l = 0; l < scenesChars.length; l++) {
                if(scenesChars[l].name == allCharacters[b].name){
                  corrMatrix[a][b] += (toSecs(epiScenes[j].sceneEnd) - toSecs(epiScenes[j].sceneStart))
                }
              }
            }
          }
        }
      }

    }
  }
});
