## Easy Way

Download the extension from the store:
- For Chrome [click here](https://chrome.google.com/webstore/detail/coinvaluegatherer/mkekmkkaginnjcoicjcoieodjmbbnfcb)
- For Opera (Work in progress)
- For Firefox (Work in progress)

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm run build`


#### Load the extension in **Chrome** or **Opera**
1. Open Chrome/Opera browser and **navigate to** [chrome://extensions](chrome://extensions)
2. Select **"Developer Mode"** and then click **"Load unpacked extension..."**
3. From the file browser, choose to `extension-boilerplate/build/chrome` or `extension-boilerplate/build/opera`


#### Load the extension in Firefox
1. Open Firefox browser and navigate to about:debugging
2. Click "Load Temporary Add-on" and from the file browser, choose `extension-boilerplate/build/firefox`


## Developing
The following tasks can be used when you want to start developing the extension and want to enable live reload - 

- `npm run chrome-watch`
- `npm run opera-watch`
- `npm run firefox-watch`


## Packaging
Run `npm run dist` to create a zipped, production-ready extension for each browser. You can then upload that to the appstore.


## Features, not ordered by delivery time

- [x] Display full amount of coins credited
- [x] Conversion of the credited coins to USD ($)
- [x] Display of historical data for that coin
- [x] Display total of USD ($) that you own in the pool
- [x] Local cache for the requests to not overload the coin server
- [ ] Add extensionfor Firefox and Opera
- [ ] Internationalization, planned supported languages (en, es, de, fr, nl, ru?)
- [ ] Disable button to leave miningpoolhub as it was originally
- [ ] Coin conversion to user local currency


If you have any questions or comments, please create a new issue. I'd be happy to hear your thoughts.


## Donate

#### If you feel like donating I will be more than thankful for that.

Bitcoin address: 3FSvvtKUhM52aQbvRs5yD8wj8piYYcQQiR

Ethereum address: 0xa6Ace49767D14709ff282ed2e725aB5Ea27A2ee7

Litecoin address: LWqjQkBiNRLvrVpdGPtLw7gNnhz1WiUYLt