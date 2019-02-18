var cheerio = require ('cheerio'); //provide the querry manipulations
var request = require ('request');
var url = 'https://www.relaischateaux.com/fr/site-map/etablissements';


request(url, function(err, resp, body) 
{
    if (!err && resp.statusCode == 200) //to check if there's no error in downloading
    { 

   
    if(body)
    {
        var $ = cheerio.load(body);
    }
    else
    {
        // body is null or empty
    }


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
                        console.log($(this).filter("a").text().trim());
                        console.log($(this).attr("href"));
                    }
                })
            })
        }
    })
   }
});
