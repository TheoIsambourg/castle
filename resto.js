var cheerio = require ('cheerio'); //provide the querry manipulations
var request = require ('request');
var fs = require('fs');
const fetch = require("node-fetch");


scrappingRestos()

async function scrappingRestos(){

    var listOfRestaurants = [];
    var res = await fetch("https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin")
    res = await res.text()
    var $ = cheerio.load(res);

    $('div .poi_card-description').each(function(i) //context
    {   
        $(this).find("div .poi_card-display-title").each(function(k)
        {
            var name= $(this).text().trim();
            listOfRestaurants.push({ "name": name})
        })
        
    });
    

   
   fs.writeFileSync("listOfRestaurantsEtoiles.json", JSON.stringify(listOfRestaurants, null, 2));
}

