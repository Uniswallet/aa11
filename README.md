## Intro

[stablexswap](https://www.stablex.finance/) is an automated market maker (“**AMM**”) for stable coin that allows two tokens to be exchanged on [Binance Smart Chain](https://www.binance.org/en/smartChain) (BSC). It is fast, cheap, and allows anyone to participate.

## Run locally

Install packages

```js
yarn
```

Start application

```js
yarn start
```

## Change BSC network

To change the BSC network from test net, modify the `REACT_APP_CHAIN_ID` value in `.env`.

- MAIN NET `56`

## Run integration tets

Firstly, if you need to install cypress

```js
yarn cypress install
```

Then to run the Cypress suite in CLI

```js
yarn cypress run
```

Or, to run Cypress with its GUI

```js
yarn cypress open
```

---
