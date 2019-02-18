var cheerio = require ('cheerio'); //provide the querry manipulations
var request = require ('request');
var fs = require('fs');
const fetch = require("node-fetch");

scrapping()

async function scrapping(){
    var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

    var listOfrestaurants = [];
    var res = await fetch("https://www.relaischateaux.com/us/site-map/etablissements")
    res = await res.text()
    var $ = cheerio.load(res);

    $("#countryF").each(function(i) //context
    {
        if ($(this).find("h3").text() === 'France')
        {
            //console.log("hello")
            $(this).find("li").each(function(j)
            {
                $(this).find("a").each(function(k)
                {
                    if(k==0)
                    {
                        var name = $(this).filter("a").text().trim();
                        var link = $(this).attr("href");
                        console.log ($(this).filter("a").text().trim());
                        console.log ($(this).attr("href"));
                        listOfrestaurants.push({ "name": name, "link": link})
                    }
                })
            })
        }
    })
   fs.writeFileSync("restauHotel.json", JSON.stringify(listOfrestaurants, null, 2));
}

