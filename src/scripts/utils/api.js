let $ = require('jquery');
let cacheSolution = require('./cacheSolution');

let makeCallForCoinValue = (coinName, currency) => {
    // NOTE: IF there is nothing in the cache or the
    // time is too far away in the past 20171215:Alevale
    let cachedUniqueId = `${coinName},${currency || 'USD'}`;
    if ( !cacheSolution.getFromCache(cachedUniqueId) || cacheSolution.isExpired(cacheSolution.getFromCache(cachedUniqueId).timestamp) ) {

        return new Promise((res, rej) => {
            return $.ajax({
                url: `https://api.coinmarketcap.com/v1/ticker/${coinName}/?convert=${currency || 'USD'}`,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    cacheSolution.writeToCache(cachedUniqueId, data[0]);
                    res(data[0])
                },
                error: function() {
                    res({})
                }
            });
        });

    } else {
        return Promise.resolve(cacheSolution.getFromCache(cachedUniqueId).data)
    }
};

module.exports = {
    makeCallForCoinValue
};