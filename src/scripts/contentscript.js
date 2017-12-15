'use-strict';

import {makeCallForCoinValue} from './utils/api';
// NOTE: This is needed because Jquery is doing weird things
// in the communication with the page... 20171215:Alevale
let $ = require('jquery');

let makeTableFullWith = () => {
    $('.width_62_percent').addClass('width_full');
    $('.width_62_percent').removeClass('width_62_percent');
};

let getCoinValuesFromTable = () => {
    let table = $('tbody');

    if (table) {
        let tableChildren = table.children();
        let totalMoney = 0;
        let totalMoney24Ago = 0;

        let div = $('<div></div>');
        div.append($('<h4 class="totalmoney"></h4>'));
        $(table.parent().parent()).prepend(div);

        $('thead>tr').append($('<th class="explanation"></th>'));

        tableChildren.each((k, v) => {
            let val = $(v);

            if (val.is('tr') && val.text().match(/Manage Wallet/)) {

                let coinName = val.text().split('\n')[1];
                let coins = val.text().split('\n')[2];
                let match = coins.match(/(.*) \((.*)\)/);
                let totalCoins = match ? Number(match[1]) + Number(match[2]) : Number(coins);

                makeCallForCoinValue(coinName).then((res) => {
                    let value = res.price_usd * totalCoins;
                    let value24Ago = ((-res.percent_change_24h / 100) + 1 ) * res.price_usd * totalCoins;

                    totalMoney += value;
                    totalMoney24Ago += value24Ago;

                    $('.totalmoney').text(`Total value now (${totalMoney.toFixed(2)} $), 
                    this same amount of coins 24 hours ago was (${totalMoney24Ago.toFixed(2)} $), 
                    by keeping the coin unchanged you made (${(totalMoney - totalMoney24Ago).toFixed(2)} $)`);
                    $('.explanation').text(`Coin values in real time`);

                    let td = $('<td></td>');

                    td.append($('<tr></tr>').text(`Coins ${totalCoins}`));
                    td.append($('<tr></tr>').text(`USD (${value.toFixed(2)} $)`));
                    td.append($('<tr></tr>').text(`USD 24 ago (${value24Ago.toFixed(2)} $)`));
                    td.append($('<tr></tr>').text(`${coinName} valuation 1h ago ${res.percent_change_1h}%`));
                    td.append($('<tr></tr>').text(`${coinName} valuation 24h ago ${res.percent_change_24h}%`));

                    val.append(td);
                    makeTableFullWith();
                });
            }

        });

    }
};

getCoinValuesFromTable();