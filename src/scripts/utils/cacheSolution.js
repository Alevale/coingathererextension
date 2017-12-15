let writeToCache = (coinName, data) => {
    let cache = JSON.parse(localStorage.getItem('cache')) || {};
    cache[coinName] = {
        data: data,
        timestamp: new Date().getTime()
    };
    return localStorage.setItem('cache', JSON.stringify(cache));
};

let getFromCache = (coinName) => {
    let cache = JSON.parse(localStorage.getItem('cache')) || {};
    return cache[coinName];
};

let isExpired = (timestamp) => {
    let min = 2;
    let cacheMinutes = 1000 * 60 * min;
    let now = new Date().getTime();
    return now - timestamp >= cacheMinutes;
};

module.exports = {
  writeToCache,
  getFromCache,
  isExpired
};