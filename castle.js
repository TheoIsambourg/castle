var cheerio = require ('cheerio'); //provide the querry manipulations
var request = require ('request');
var fs = require('fs');
const fetch = require("node-fetch");

scrappingHotels()

async function scrappingHotels(){

    var listOfHotels = [];
    var res = await fetch("https://www.relaischateaux.com/us/site-map/etablissements")
    res = await res.text()
    var $ = cheerio.load(res);

    $("#countryF").each(function(i) //context
    {
        if ($(this).find("h3").text() === 'France')
        {
           
            $(this).find("li").each(function(j)
            {
                $(this).find("a").each(function(k)
                {
                    if(k==0)
                    {
                        var name = $(this).filter("a").text().trim();
                        var link = $(this).attr("href");
                        listOfHotels.push({ "name": name, "link": link})
                    }
                })
            })
        }
    })
   fs.writeFileSync("listOfHotelsFrance.json", JSON.stringify(listOfHotels, null, 2));
}

