let writeToCache = (value, data) => {
    let cache = JSON.parse(localStorage.getItem('cache')) || {};
    cache[value] = {
        data: data,
        timestamp: new Date().getTime()
    };
    return localStorage.setItem('cache', JSON.stringify(cache));
};

let getFromCache = (value) => {
    let cache = JSON.parse(localStorage.getItem('cache')) || {};
    return cache[value];
};

let isExpired = (timestamp) => {
    let min = 2;
    let cacheMinutes = 1000 * 60 * min;
    let now = new Date().getTime();
    return now - timestamp >= cacheMinutes;
};


let saveInChromeStore = (name, data) => {
    let jsonfile = {};
    jsonfile[name] = JSON.stringify({
        data
    });
    chrome.storage.sync.set(jsonfile, function() {
        console.log('Saved');
    });
};


let getFromChromeStore = (name, defaultValue) => {
    return new Promise((res, rej) => {
        chrome.storage.sync.get(name, (result) => {

            if (result && result[name]) {
                let value = JSON.parse(result[name]).data;
                return res(value || defaultValue);
            }

            return res(defaultValue);
        });
    });
};


chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key];
        let oldValue = storageChange.oldValue ? JSON.parse(storageChange.oldValue) : {};
        let newValue = storageChange.newValue ? JSON.parse(storageChange.newValue) : {};

        callers.forEach((caller) => {
            if (caller.changedObjectKeyName === key) {
                caller.callback(oldValue, newValue);
            }
        });
    }
});

let callers = [];
let subscribeTo = (changedObjectKeyName, callback) => {
    callers.push({
        changedObjectKeyName,
        callback
    });
};

module.exports = {
    writeToCache,
    getFromCache,
    isExpired,
    saveInChromeStore,
    getFromChromeStore,
    subscribeTo
};