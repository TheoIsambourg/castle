var request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var he = require('he');
const fetch = require("node-fetch");
const rp = require('request-promise');


async function michelin(hostels) {
    let res = []
    for (let i = 0; i < hostels.length; i++) {
        res.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hostels[i].name.slice(0, -1))))
    }
    let trash = []
    for (let i = 0; i < hostels.length; i++) {
        var response = await res[i]
        response = (await response.json())
        if (response.toString().includes("Aucun résultat.")) {
            trash.push(i)
        }
        else {
            response = await JSON.stringify(response)
            if (response.includes("poi")) {
                response = await JSON.parse(response)
                let keys = Object.keys(response)
                let key = null
                for (let j = keys.length - 1; j != -1; j--) {
                    if (keys[j] != "poi-all" && keys[j].includes("poi")) {
                        key = keys[j]
                    }
                }
                if (key != null) {
                    response = response[key].split('"')[1]
                    hostels[i].michelinUri = "https://restaurant.michelin.fr" + response
                }
            }
        }
    }
    hostels = removeNonMichelin(hostels)
    hostels = await countMichelinStars(hostels)
    return hostels
}

async function countMichelinStars(hostels) {
    let res = []
    for (let i = 0; i < hostels.length; i++) {
        res.push(fetch(hostels[i].michelinUri))
    }
    let star = 0
    for (let i = 0; i < hostels.length; i++) {
        var response = await res[i]
        response = await response.text()
        star = 0
        if (response.includes("icon-cotation1etoile")) {
            star = 1
        }
        else if (response.includes("icon-cotation2etoiles")) {
            star = 2
        }
        else if (response.includes("icon-cotation3etoiles")) {
            star = 3
        }
        else if (response.includes("icon-cotation4etoiles")) {
            star = 4
        }
        else if (response.includes("icon-cotation5etoiles")) {
            star = 5
        }
        else if (response.includes("icon-cotation6etoiles")) {
            star = 6
        }
        hostels[i].michelinStars = star
    }
    return hostels
}



function removeNonMichelin(hostels) {
    let result = []
    for (let i = 0; i < hostels.length; i++) {
        if (hostels[i].michelinUri != undefined) {
            result.push(hostels[i])
        }
    }
    return result
}

