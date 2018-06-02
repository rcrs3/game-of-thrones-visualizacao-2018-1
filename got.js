var epi
var allCharacters = []
corrMatrix = []
charQuant = 50

var canvasMatrix = d3.select("#screenMatrix")
var canvasVenn = d3.select("#Venn")

var margin = {top:150, bottom:150, left:150, right:150}
var widthMatrix = screenMatrix.width.baseVal.value - margin.left - margin.right
var heightMatrix = screenMatrix.height.baseVal.value - margin.bottom - margin.top

var xScaleMatrix = d3.scaleLinear()
               .domain([0, charQuant])
	             .range([margin.left , widthMatrix]);

var yScaleMatrix = d3.scaleLinear()
               .domain([0, charQuant])
	             .range([heightMatrix , margin.top]);

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

  desiredCharacters = []
  for (var i = 0; i < charQuant; i++) {
    desiredCharacters.push(allCharacters[i])
  }

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
            if(scenesChars[k].name == desiredCharacters[a].name){
              for (var l = 0; l < scenesChars.length; l++) {
                if(scenesChars[l].name == desiredCharacters[b].name){
                  corrMatrix[a][b] += (toSecs(epiScenes[j].sceneEnd) - toSecs(epiScenes[j].sceneStart))
                }
              }
            }
          }
        }
      }

    }
  }

  corrArray = []
  for (var i = 0; i < charQuant; i++) {
    for (var j = 0; j < charQuant; j++) {
      corrArray.push(corrMatrix[i][j])
    }
  }

  var cellsGroup = canvasMatrix.append("g").attr("id", "cellsGroup")
  var rowTextsGroup = canvasMatrix.append("g").attr("id", "rowTextsGroup")
  var columnTextsGroup = canvasMatrix.append("g").attr("id", "columnTextsGroup")

  var matrixCells = canvasMatrix.select("#cellsGroup").selectAll("rect").data(corrArray).enter()
                               .append("rect")
                               .attr("x", function (d, index) { return xScaleMatrix(index % charQuant); })
                               .attr("y", function (d, index) { return heightMatrix + margin.top - yScaleMatrix(Math.floor(index/charQuant));})
                               .attr("width", function (d, index) { return xScaleMatrix(index+1) - xScaleMatrix(index); })
                               .attr("height", function (d, index) { return yScaleMatrix(index) - yScaleMatrix(index+1); })
                               .attr("fill", "Navy")
                               .attr("fill-opacity", function(d, index){
                                 return Math.sqrt(d/corrArray[0])
                                   //criar um scale de cor apropriado depois
                               })
                               .attr("stroke", "black")
                               .attr("stroke-width", 0.7)

  var rowTexts = canvasMatrix.select("#rowTextsGroup").selectAll("text").data(desiredCharacters).enter()
                              .append("text")
                              .attr("x", margin.left - 5)
                              .attr("y", function (d, index) {return heightMatrix + margin.top - yScaleMatrix(index+1);})
                              .text( function (d) { return d.name; })
                              .style("fill", "black")
                              .attr("font-size", "16px")
                              .style("alignment-baseline", "ideographic")
                              .style("text-anchor", "end")

  var columnTexts = canvasMatrix.select("#columnTextsGroup").selectAll("text").data(desiredCharacters).enter()
                              .append("text")
                              .attr("x", function (d, index) {return xScaleMatrix(index % charQuant); })
                              .attr("y", margin.top)
                              .text( function (d) { return d.name; })
                              .style("fill", "black")
                              .attr("font-size", "16px")
                              .style("alignment-baseline", "ideographic")
                              .attr('transform', function(d, index) {
                                return 'translate( '+
                                (xScaleMatrix(index+1) - margin.left)
                                +' , '+
                                (yScaleMatrix(charQuant)+(index*(yScaleMatrix(index) - yScaleMatrix(index+1)))+margin.top-5)
                                +'),'+ 'rotate(-90)';
                              })
});



// var matrixCells = canvasMatrix.selectAll("rect").data(corrMatrix).enter()
//                              .append("rect")
//                              .attr("x", function (d, index) { return xScaleMatrix(index); })
//                              .attr("y", function (d, index) { return yScaleMatrix(index); })
//                              .attr("width", function (d, index) { return xScaleMatrix(index+1) - xScaleMatrix(index); })
//                              .attr("height", function (d) { return yScaleMatrix(index+1) - yScaleMatrix(index); })
//                              .attr("stroke", "black")
//                              .attr("stroke-width", 0.5)
//                              .attr("active", 1)
//                              .attr("opacity", 1)
//                              .style("fill", function (d) {
//                                if (d.Company === "Gol"){
//                                  return "orange"
//                                }
//                                else if (d.Company === "Tam") {
//                                  return "red"
//                                }
//
//                                else if (d.Company === "Azul") {
//                                  return "blue"
//                                }
//
//                                else {
//                                  return "black"
//                                }
//                              })
//                              .on("click", function(){
//                                var isOn = d3.select(this).attr("active")
//                                if (isOn == 1) newOpacity = 0.1
//                                else newOpacity = 1
//                                d3.select(this).attr("opacity", newOpacity)
//                                               .attr("active", Math.floor(newOpacity))
//                                updateScatPlot(d3.select(this).attr("company"), newOpacity)
//                              });
