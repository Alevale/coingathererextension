import ext from "./utils/ext";
let cacheSolution = require('./utils/cacheSolution');

let $ = require('jquery');

let optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
});

let supportedCurrencies = ["USD", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];

$(document).ready(function(){
    let select = $('#currencies');
    supportedCurrencies.forEach((currency) => {
        let option = $('<option/>');
        option.attr({ 'value': currency }).text(currency).on('click', (val) => {
            console.log('clicked!', val);
        });
        select.append(option);
    });

    // NOTE: Set the currency from the chrome sync storage 20171220:Alevale
    cacheSolution.getFromChromeStore('savedCurrency', 'USD')
        .then((value) => select.val(value || "USD"));

    select.change(()=>{
        console.log(select.val());
        // NOTE: Store the currency in the cache to retrieve it when needed 20171220:Alevale
        cacheSolution.saveInChromeStore('savedCurrency', select.val());
    })
});

cacheSolution.subscribeTo('savedCurrency', (oldValue, newValue) => {
    console.log('got changes!!', oldValue, newValue);
});