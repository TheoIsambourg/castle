var cheerio = require ('cheerio'); //provide the querry manipulations
var request = require ('request');
var fs = require('fs');
const fetch = require("node-fetch");


const URLpage = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin"

const AllURLs = scrapURLs(URLpage)  //1st : we scrap the URLs of the 35 pages of retaurants with at minimum 1 star

scrappingRestos(AllURLs)//2nd : we scrap the names of the restaurants


function scrapURLs(URL){

  var listOfURLs = []

  listOfURLs[0] = URL

  for(var j = 1; j < 35; j++) 
  {
    listOfURLs[j] =  URL  +  '/page-'+  (j+1).toString()
  }

  return listOfURLs;

}





async function scrappingRestos(listOfURLs){
    var listOfRestaurants = [];

    for (var j = 0; j < listOfURLs.length; j ++){
        
        var res = await fetch(listOfURLs[j])
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
    

   
    }
fs.writeFileSync("listOfRestaurantsEtoiles.json", JSON.stringify(listOfRestaurants, null, 2));

}

