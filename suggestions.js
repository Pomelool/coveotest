const fs = require('fs');
var FuzzySearch = require('fuzzy-search');
var City = require("./city.js");

var getSuggestions = async (query) => {
    const q = query.q;
    const latitude = query.latitude;
    const longitude = query.longitude;

    // case of empty query string
    if (q === null || q === undefined || q.trim() === '') {
        return {"Message": "Please query with at least a query string"}
    }

    // read tsv file and process the data
    var db = await fs.readFileSync('./public/cities_canada-usa.tsv').toString().split('\n');
    var dataSet = [];
    for (let i = 0; i < db.length; i++) {
        dataSet.push(db[i].split('\t'));
    }
    dataSet.splice(0, 1);

    //initiate City objects from the data
    var cities = [];
    for (let city of dataSet) {
        cities.push(new City(city[0], city[1], city[2], city[3], city[4], city[5], city[6], city[7],
            city[8], city[9], city[10], city[11], city[12], city[13], city[14], city[15], city[16]));
    }

    // fuzzy search the db
    var fuzzy = new FuzzySearch(cities, ['name'], {
        caseSensitive: false,
    });
    var result = fuzzy.search(q);

    //include the city that has one alt_name precisely match with the search term
    for (let city of cities) {
        if (city.alt_name != null && city.alt_name.split(',').includes(q) && result.filter(e => e.name == city.name).length == 0) {
            result.push(city);
        }
    }

    // calculate the score and sort it
    calcScore(result, q, latitude, longitude);
    result.sort(function (c1, c2) {
        return c2.score - c1.score;
    });

    //generate the output objects
    var formattedRes = [];
    for (let res of result) {
        formattedRes.push({
            "name": res.name,
            "latitude": res.lat,
            "longitude": res.long,
            "score": res.score
        });
    }
    return { "suggestions": formattedRes };
}

function calcScore(arr, q, latitude, longitude) {
    for (let city of arr) {
        // Calculate score lost caused by locations. 
        // The score will minus 0.05 * sum(abs(latitude different) + abs(longitude difference))
        // Location score lost is up to 0.3
        if (latitude != null && city.lat != null) {
            var latDiff = latitude - city.lat;
        }
        if (longitude != null && city.long != null) {
            var longDiff = longitude - city.long;
        }
        var distanceDiff = Math.abs(latDiff) + Math.abs(longDiff);
        var distMinus = distanceDiff * 0.02;
        if (distMinus > 0.3) {
            distMinus = 0.3;
        }
        city.score -= distMinus;

        // Calculate score lost caused by name. 
        // name include search word: the score will minus 0.01 * number of different digits, score loss up to 0.5
        // fuzzy match : the score will minus 0.05 * number of different digits, score loss up to 0.3
        if (city.name !== q && !city.name.includes(q) && !city.alt_name.split(',').includes(q)) {
            var nameMinus = (city.name.length - q.length) * 0.05;
            if (nameMinus > 0.5) {
                nameMinus = 0.5;
            }
            city.score -= nameMinus;
        }
        else if (city.name !== q && city.name.includes(q) && !city.alt_name.split(',').includes(q)) {
            var nameMinus = (city.name.length - q.length) * 0.01;
            if (nameMinus > 0.3) {
                nameMinus = 0.3;
            }
            city.score -= nameMinus;
        }

        city.score = Math.round(city.score*10000) / 10000;
    }
}

module.exports = { getSuggestions: getSuggestions };