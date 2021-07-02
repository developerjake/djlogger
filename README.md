# DJ Link Trader

## Overview

The plan is to create an trading bot. To start with, this bot will be solely focused on the LINK/USDT trading pair, hence the project name. It will use a Binance USD-M Futures Account to trade a perpetual futures LINK/USDT contract using large leverage.

Stretch goals include allowing other trading pairs. At this time there is no intent to cater for Spot, Margin, or COIN-M Futures trading.

## Disclaimer

This is my own, personal trading bot - it was not made for anyone but myself. I will not be held liable for the result of the use of this program in any way, shape or form, be that financial loss, a breach of security, or otherwise.

## Setup

As this bot will be trading through a Binance Account, the user must provide a public API key and API secret from Binance. This should be set into a `.env` file. The `.env` file not included with the source code, and ignored via the `.gitignore`; nonetheless, users should take particular care to ensure this file does not erroneously make its way into the source-controlled files, for peril of breaching the security of their Binance Account.

The API key and secret can be obtained from Binance's website [here](https://www.binance.com/en/my/settings/api-management) once the user has logged in. The API should be set up with these permissions, and **nothing more**:
* Enable Reading
* Enable Futures

### Dependencies

To run the development environment you will need:

* [nodejs v14.17.0 LTS](https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi) as run the project
* [yarn](https://yarnpkg.com/lang/en/docs/install/) to manage dependencies

The service uses the following:

* [Koa](https://koajs.com/) as the server framework
* [Koa Router](https://github.com/alexmingoia/koa-router) for routing
* [Jest](https://facebook.github.io/jest/) for testing

### Getting Started

The following commands to get up and running in (typically) under a minute:

* `yarn install` - install all dependencies
* `yarn build` - compile the Typescript into Javascript
* `yarn start` - compile and run the web server, watching for updates and restarting as required

### Gatcha

If for whatever reason, the default port (3000) is unavailable on your machine, you can change on Windows by writing `set PORT=3001` into the terminal, or if you are on Linux, by adding to the `start` command as `PORT=3001 yarn start`.
