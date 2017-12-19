'use-strict';

import {makeCallForCoinValue} from './utils/api';
// NOTE: This is needed because Jquery is doing weird
// things when required in an extension 20171215:Alevale
let $ = require('jquery');

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
let makeUIPageArrangements = () => {
    let div = $('<div></div>');
    div.append($('<h4 class="totalmoneydisclaimer"></h4>'));
    $($('tbody').parent().parent()).prepend(div);
    $('thead>tr').append($('<th class="tableheaderComment"></th>'));
    makeContentFullWidth();
};

// NOTE: This function has all the logic currently to arrange the page and call the coins 20171217:Alevale
let getCoinValuesFromTable = () => {
    if (verifyTheTargetedTable()) {

        makeUIPageArrangements();

        let totalMoney = 0;
        let totalMoney24Ago = 0;

        $('tbody').children().each((key, r) => {

            let row = $(r);
            let coinName = row.text().split('\n')[1];
            let coins = row.text().split('\n')[2];
            let match = coins.match(/(.*) \((.*)\)/);
            let totalCoins = match ? Number(match[1]) + Number(match[2]) : Number(coins);

            makeCallForCoinValue(coinName).then((res) => {
                if (res && res.percent_change_24h) {
                    let value = res.price_usd * totalCoins;
                    let value24Ago = ((-res.percent_change_24h / 100) + 1 ) * res.price_usd * totalCoins;

                    totalMoney += value;
                    totalMoney24Ago += value24Ago;

                    $('.totalmoneydisclaimer').text(`Total value now $${totalMoney.toFixed(2)}. 
                    This same amount of coins 24 hours ago was valued in $${totalMoney24Ago.toFixed(2)}. 
                    The difference is $${(totalMoney - totalMoney24Ago).toFixed(2)}`);
                    $('.tableheaderComment').text(`Coin values in real time`);

                    let td = $('<td></td>');

                    td.append($('<tr></tr>').text(`Credited coins ${totalCoins}`));
                    td.append($('<tr></tr>').text(`USD ($${value.toFixed(2)})`));
                    td.append($('<tr></tr>').text(`USD 24 ago ($${value24Ago.toFixed(2)})`));
                    td.append($('<tr></tr>').text(`${coinName} price 24h ago $${(((-res.percent_change_24h / 100) + 1 ) * res.price_usd).toFixed(2)}`));
                    td.append($('<tr></tr>').text(`${coinName} price now $${Number(res.price_usd).toFixed(2)}, ${res.percent_change_24h}%`));

                    row.append(td);

                } else {
                    let td = $('<td></td>');

                    td.append($('<tr></tr>').text(`Sorry, right now this coin is not supported`));
                    td.append($('<tr></tr>').text(`We are still working on implementing more coins to the system`));

                    row.append(td);
                }

            });

        });
    }
};

getCoinValuesFromTable();