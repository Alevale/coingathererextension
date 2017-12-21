'use-strict';

import {makeCallForCoinValue} from './utils/api';
// NOTE: This is needed because Jquery is doing weird
// things when required in an extension 20171215:Alevale
const $ = require('jquery');
const cacheSolution = require('./utils/cacheSolution');
const getSymbolFromCurrency = require('currency-symbol-map');

// NOTE: Make the content of the page full width to have
// enough space for the new info 20171217:Alevale
let makeContentFullWidth = () => {
    let el = $('.width_62_percent');
    el.addClass('width_full');
    el.removeClass('width_62_percent');
};

// NOTE: Evaluate if the page is the one we want to target 20171217:Alevale
let verifyTheTargetedTable = () => {
    return $('thead>tr>th').first().text() === 'Coin';
};

// NOTE: Create the elements to fill later while iterating in the API retrieved loop 20171217:Alevale
let createUI = () => {
    let div = $('<div></div>');
    div.append($('<h4 class="totalmoneydisclaimer"></h4>'));
    $($('tbody').parent().parent()).prepend(div);
    $('thead>tr').append($('<th class="tableheaderComment"></th>'));
    makeContentFullWidth();
};

let removeUI = () => {
    $('.plugin_additional_info').remove();
    $('.totalmoneydisclaimer').text(``);
    $('.tableheaderComment').text(``);

};

// NOTE: Whenever a change to the currency occurs, change the values on the page 20171221:Alevale
cacheSolution.subscribeTo('savedCurrency', (oldVal, newVal) => {
    removeUI();
    fillInWebpageValues(newVal.data || "USD");
});

// NOTE: This function has all the logic currently to arrange the page and call the coins 20171217:Alevale
let fillInWebpageValues = (currency) => {
    let totalMoney = 0;
    let totalMoney24Ago = 0;
    // NOTE: This has to be done because the API answers with price_usd, price_eur and so on... 20171221:Alevale
    let price_coin_name = `price_${currency.toLowerCase()}`;

    $('tbody').children().each((key, r) => {

        let row = $(r);
        let coinName = row.text().split('\n')[1];
        let coins = row.text().split('\n')[2];
        let match = coins.match(/(.*) \((.*)\)/);
        let totalCoins = match ? Number(match[1]) + Number(match[2]) : Number(coins);

        makeCallForCoinValue(coinName, currency).then((res) => {
            let currencySymbol = getSymbolFromCurrency(currency);
            let td = $('<td class="plugin_additional_info"></td>');

            if (res && res.percent_change_24h) {
                let value = res[price_coin_name] * totalCoins;
                let value24Ago = ((-res.percent_change_24h / 100) + 1 ) * res[price_coin_name] * totalCoins;

                totalMoney += value;
                totalMoney24Ago += value24Ago;

                $('.totalmoneydisclaimer').text(`Total value now ${currency} ${currencySymbol} ${totalMoney.toFixed(2)}. 
                        This same amount of coins 24 hours ago was valued in ${currency} ${currencySymbol} ${totalMoney24Ago.toFixed(2)}. 
                        The difference is ${currency} ${currencySymbol} ${(totalMoney - totalMoney24Ago).toFixed(2)}`);
                $('.tableheaderComment').text(`Coin values in real time`);


                td.append($('<tr class="plugin_coin_amount"></tr>').text(`Credited coins ${totalCoins}`));
                td.append($('<tr class="plugin_credited_changes"></tr>').text(`Value now ${currency} ${currencySymbol} ${value.toFixed(2)}`));
                td.append($('<tr class="plugin_on_exchange_changes"></tr>').text(`Value 24 hours ago ${currency} ${currencySymbol} ${value24Ago.toFixed(2)}`));
                td.append($('<tr class="plugin_global_coin_changes"></tr>').text(`${coinName} price 24h ago ${currency} ${currencySymbol} ${(((-res.percent_change_24h / 100) + 1 ) * res[price_coin_name]).toFixed(2)}`));
                td.append($('<tr class="plugin_global_coin_changes24"></tr>').text(`${coinName} price now ${currency} ${currencySymbol} ${Number(res[price_coin_name]).toFixed(2)}, ${res.percent_change_24h}%`));

                row.append(td);

            } else {

                td.append($('<tr class="plugin_error"></tr>').text(`Sorry, right now this coin is not supported`));
                td.append($('<tr class="plugin_to_be_implemented"></tr>').text(`We are still working on implementing more coins to the system`));

                row.append(td);
            }

        });

    });
};

// NOTE: Get all the coins for the first time 20171221:Alevale
let getCoinValuesFromTable = () => {
    if (verifyTheTargetedTable()) {

        createUI();

        cacheSolution.getFromChromeStore('savedCurrency', 'USD').then((currency) => {
            fillInWebpageValues(currency);
        });
    }
};

getCoinValuesFromTable();