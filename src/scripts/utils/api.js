let $ = require('jquery');
let cacheSolution = require('./cacheSolution');

let makeCallForCoinValue = (coinName) => {
    // NOTE: IF there is nothing in the cache or the
    // time is too far away in the past 20171215:Alevale
    if (cacheSolution.isExpired(cacheSolution.getFromCache(coinName).timestamp)) {

        return new Promise((res, rej) => {
            return $.ajax({
                url: `https://api.coinmarketcap.com/v1/ticker/${coinName}/`,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    cacheSolution.writeToCache(coinName, data[0]);
                    res(data[0])
                },
                error: function() {
                    res({})
                }
            });
        });

    } else {

        return Promise.resolve(cacheSolution.getFromCache(coinName).data)

    }
};

module.exports = {
    makeCallForCoinValue
};