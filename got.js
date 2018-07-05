var epi
var allCharacters = []
corrMatrix = []
charQuant = 50

var canvasMatrix = d3.select("#screenMatrix")
var canvasVenn = d3.select("#screenMatrix").append("g").attr("transform", "translate( 700,250)");

var margin = {top:150, bottom:150, left:150, right:450}
var widthMatrix = screenMatrix.width.baseVal.value - margin.left - margin.right
var heightMatrix = screenMatrix.height.baseVal.value - margin.bottom - margin.top

var xScaleMatrix = d3.scaleLinear()
               .domain([0, charQuant])
	             .range([margin.left , widthMatrix]);

var yScaleMatrix = d3.scaleLinear()
               .domain([0, charQuant])
	             .range([heightMatrix , margin.top]);

var colorScaleMatrix = d3.scaleLinear()
              .domain([0,50,500,4000,8000,20000,32956])
              .range(['white','#f7fbff','#c6dbef','#6baed6','#2171b5','#08519c','#08306b']);

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

function distance(arr1, arr2){
  som = 0
  for (var i = 0; i < arr1.length; i++) {
    som += (Math.sign(arr1[i]) - Math.sign(arr2[i]))**2
  }

  return (Math.sqrt(som))
}

function calcDists(matrix) {
  distMatrix = []
  for (var i = 0; i < matrix.length; i++) {
    idist = []
    for (var j = 0; j < matrix.length; j++) {
      idist.push(distance(matrix[i],matrix[j]))
    }
    distMatrix.push(idist)
  }
  return distMatrix
}

function getMin(matrix){
  minValue = Number.MAX_SAFE_INTEGER
  imin = 0
  jmin = 0
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] < minValue) {
        imin = i
        jmin = j
        minValue = matrix[i][j]
      }
    }
  }
  return [imin, jmin]
}

function clusters(matrix, clustNumber){
  var distMatrix = calcDists(matrix)
  for (var i = 0; i < distMatrix.length; i++) {
    distMatrix[i][i] = Number.MAX_SAFE_INTEGER
  }

  myclusters = []
  for (var i = 0; i < distMatrix.length; i++) {
    myclusters.push(i)
  }
  for (var i = myclusters.length; i > clustNumber; i--) {
    posMin = getMin(distMatrix)
    ind0 = posMin[0]
    ind1 = posMin[1]
    if (ind1<ind0){
      indaux = ind0
      ind0 = ind1
      ind1 = indaux
    }
    value0 = myclusters[ind0]
    value1 = myclusters[ind1]
    for (var k = 0; k < myclusters.length; k++) {
      for (var l = 0; l < myclusters.length; l++) {
        if (myclusters[k] == value0) {
          if (myclusters[l] == value1){
            distMatrix[l][k] = Number.MAX_SAFE_INTEGER
            distMatrix[k][l] = Number.MAX_SAFE_INTEGER
          }
        }
      }
    }
    for (var l = 0; l < myclusters.length; l++) {
      if (myclusters[l] == value1){
        myclusters[l] = value0
      }
    }
    counter = 0
    for (var m = 0; m < myclusters.length; m++) {
      if (myclusters[m] == value0) counter++
    }

    if (counter>(charQuant/clustNumber)) {
      for (var n = 0; n < myclusters.length; n++) {
        if (myclusters[n] == value0){
          for (var p = 0; p < myclusters.length; p++) {
            distMatrix[n][p] = Number.MAX_SAFE_INTEGER
            distMatrix[p][n] = Number.MAX_SAFE_INTEGER
          }
        }
      }
    }
  }

  return myclusters

}

function orderClusters(myclusters){
  var counter = 0
  orderedClusters = []
  for (var i = 0; i < myclusters.length; i++) {
    orderedClusters.push(i)
  }

  for (var i = 0; i < myclusters.length; i++) {
    for (var j = 0; j < myclusters.length; j++) {
      if (myclusters[j] == i) {
        orderedClusters[j]=counter
        counter++
      }
    }
  }
  return orderedClusters
}

function drawMatrix(charQuant) {
  d3.json("https://raw.githubusercontent.com/rcrs3/game-of-thrones-visualizacao-2018-1/master/data/episodes.json", function(json) {
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
                                .attr("fill", function(d){
                                  return colorScaleMatrix(d)
                                })
                                // .attr("fill-opacity", function(d, index){
                                //   return Math.sqrt(d/corrArray[0])
                                // })
                                .attr("stroke", "black")
                                .attr("stroke-width", 0.7)
                                .on("mouseover", function(d, index){
                                  d3.select(this).style("cursor", "pointer");

                                  d3.select("#cellsGroup").selectAll("rect")
                                  .attr("stroke-width", function(d2, index2){
                                    if(index2==index) return 2.0
                                    else return 0.7
                                  })

                                  d3.select("#columnTextsGroup").selectAll("text")
                                    .style('fill', function(d2, index2){
                                      if(index2==(index%charQuant)) return "red"
                                      else return "black"
                                    })
                                  d3.select("#rowTextsGroup").selectAll("text")
                                    .style('fill', function(d2, index2){
                                      if(index2==(Math.floor(index/charQuant))) return "red"
                                      else return "black"
                                    })
                                })
                                .on("click", function(d, i) {
                                  //Cria diagrama de venn com os personagens selecionados
                                  
                                  var colours = ['#6b6b47', '#000000']

                                  var char1 = desiredCharacters[i%charQuant];
                                  var char2 = desiredCharacters[Math.floor(i/charQuant)];

                                  var sets = [{sets: [char1.name], size: char1.screenTime},
                                              {sets: [char2.name], size: char2.screenTime},
                                              {sets: [char1.name, char2.name], size: corrMatrix[i%charQuant][Math.floor(i/charQuant)]}];

                                  var chart = venn.VennDiagram();

                                  canvasVenn.datum(sets).call(chart);
                                  

                                  d3.selectAll(".venn-circle path")
                                    .style("fill", function(d, i) {
                                      return colours[i];
                                    })
                                    .style("fill-opacity", 0.7);
                                  
                                  d3.selectAll(".venn-circle text")
                                    .style("fill", "white");

                                  showSceneTime(canvasVenn);
                                });

  var rowTexts = canvasMatrix.select("#rowTextsGroup").selectAll("text").data(desiredCharacters).enter()
                              .append("text")
                              .attr("x", margin.left - 5)
                              .attr("y", function (d, index) {return heightMatrix + margin.top - yScaleMatrix(index+1) - 2;})
                              .text( function (d) { return d.name; })
                              .style("fill", "black")
                              .attr("font-size", "11px")
                              .style("alignment-baseline", "ideographic")
                              .style("text-anchor", "end")

  var columnTexts = canvasMatrix.select("#columnTextsGroup").selectAll("text").data(desiredCharacters).enter()
                              .append("text")
                              .attr("x", function (d, index) {return xScaleMatrix(index % charQuant); })
                              .attr("y", margin.top - 2)
                              .text( function (d) { return d.name; })
                              .style("fill", "black")
                              .attr("font-size", "11px")
                              .style("alignment-baseline", "ideographic")
                              .attr('transform', function(d, index) {
                                return 'translate( '+
                                (xScaleMatrix(index+1) - margin.left)
                                +' , '+
                                (yScaleMatrix(charQuant)+(index*(yScaleMatrix(index) - yScaleMatrix(index+1)))+margin.top-5)
                                +'),'+ 'rotate(-90)';
                              })
  });
}

function reorder() {
  numCluster = document.getElementById("nCluster").value || 1

  myclusters = clusters(corrMatrix, (numCluster))
  orderedClusters = orderClusters(myclusters)

  newCorrMatrix = []
  for (var i = 0; i < charQuant; i++) {
    line = []
    for (var j = 0; j < charQuant; j++) {
      line.push(0)
    }
    newCorrMatrix.push(line)
  }

  for (var i = 0; i < charQuant; i++) {
    for (var j = 0; j < charQuant; j++) {
      newCorrMatrix[orderedClusters[i]][orderedClusters[j]] = (corrMatrix[i][j])
    }
  }

  newCorrArray = []
  for (var i = 0; i < newCorrMatrix.length; i++) {
    for (var j = 0; j < newCorrMatrix.length; j++) {
      newCorrArray.push(newCorrMatrix[i][j])
    }
  }

  newCharacters = []
  for (var i = 0; i < charQuant; i++) {
    newCharacters.push("")
  }

  for (var i = 0; i < desiredCharacters.length; i++) {
    newCharacters[orderedClusters[i]] = desiredCharacters[i]
  }

  canvasMatrix.select("#rowTextsGroup").selectAll("text").data(newCharacters).transition().duration(500)
  .text( function (d) { return d.name; })

  canvasMatrix.select("#columnTextsGroup").selectAll("text").data(newCharacters).transition().duration(500)
  .text( function (d) { return d.name; })

  canvasMatrix.select("#cellsGroup").selectAll("rect").data(newCorrArray).transition().duration(500)
  .attr("fill", function(d){
    return colorScaleMatrix(d)
  })

  canvasMatrix.select("#cellsGroup").selectAll("rect").data(newCorrArray)
  .on("click", function(d, i) {
    //Cria diagrama de venn com os personagens selecionados

    var char1 = newCharacters[i%charQuant];
    var char2 = newCharacters[Math.floor(i/charQuant)];

    var sets = [{sets: [char1.name], size: char1.screenTime},
                {sets: [char2.name], size: char2.screenTime},
                {sets: [char1.name, char2.name], size: newCorrMatrix[i%charQuant][Math.floor(i/charQuant)]}];
    
    var chart = venn.VennDiagram();
    
    canvasVenn.datum(sets).call(chart);

    showSceneTime(canvasVenn);
  });

}

drawMatrix(charQuant);

//Mostra o tempo de cena que cada circulo representa ao passar o mouse pelo circulo
function showSceneTime(canvasVenn) {
  var tooltip = d3.select("body").append("div").attr("class", "venntooltip");

  canvasVenn.selectAll("path")
    .style("stroke-opacity", 0)
    .style("stroke", "black")
    .style("stroke-width", 3)

  var vennGroups = canvasVenn.selectAll("g");

  vennGroups
    .on("mouseover", function(d, i) {

        venn.sortAreas(canvasVenn, d);

        tooltip.transition().duration(400).style("opacity", .9);
        if (d.size/60 > 60) tooltip.text((d.size/60/60).toFixed(2) + " hours");
        else if (d.size > 60) tooltip.text((d.size/60).toFixed(2) + " minutes");
        else tooltip.text(d.size + " seconds");

        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 3)
            .style("fill-opacity", d.sets.length == 1 ? .25 : .7)
            .style("stroke-opacity", 1);
    })
    .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d, i) {
        tooltip.transition().duration(400).style("opacity", 0);
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 0)
            .style("fill-opacity", d.sets.length == 1 ? .7 : .25)
            .style("stroke-opacity", 0);
    });
}
