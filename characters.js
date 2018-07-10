d3.json("https://raw.githubusercontent.com/jeffreylancaster/game-of-thrones/master/data/episodes.json", function(json) {
    characters = {};
    json.episodes.forEach((episodio)=>{
        let seasonNum = episodio.seasonNum;
        episodio.scenes.forEach((scene)=>{
            let location = scene.location;
            let sublocation = scene.subLocation;
            scene.characters.forEach((character)=>{
                if(!(character.name in characters)){
                    characters[character.name] = {locations: []}
                }
                characters[character.name].locations.push([seasonNum]);
            });
        });
    });
    console.log(JSON.stringify(characters));
});