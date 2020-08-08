# [Curve.fi](https://www.curve.fi/) Ported on Harmony

This repo contains smart contracts & tools for a port of Curve.fi's exchange liquidity pool on Harmony.

This project was the result of a #DeFi Hackaton at Harmony during week 32.

## Requirements
* node (v12+)
* vyper ([0.1.0b17](https://pypi.org/project/vyper/0.1.0b17/))

## Installation
After cloning this repo, run:
```bash
make install
```
> Make sure to fill in the setup prompts. Double check ur env config at `./.env` 


## Build & Deploy
You can deploy the localnet and/or testnet contracts with: 
```bash
make test-deploy
```
> Note that we need to compile to byzantium evm version for harmony (done in deploy script).

You can check for basic functionalities of the test contracts with:
```bash
make test-checks
```

## Mainnet Deploy
TODO: mainnet deploy process

## Tools
**Assumes setup has been ran to set proper `.env` file**

### Tokens
#### Check Balance
```
node ./tools/tokens/balance.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/tokens/balance.js --token $HRC_TOKEN_ADDR --address $ADDRESS
``` 

#### Mint
```
node ./tools/tokens/mint.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/tokens/mint.js --token $HRC_TOKEN_ADDR --address $ADDRESS --amount 10000
``` 

### Curve
#### Pool Info
```
node ./tools/curve/info.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/curve/info.js --pool $CURVE_POOL_ADDR
```

#### Add Liquidity
```
node ./tools/curve/add.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/curve/add.js --pool $CURVE_POOL_ADDR --key $ACC_PRIV_KEY --amount 10000
```

#### Remove Liquidity
```
node ./tools/curve/remove.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/curve/re,pve.js --pool $CURVE_POOL_ADDR --key $ACC_PRIV_KEY --amount 10000000
```

#### Exchange Coins
```
node ./tools/curve/exchange.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/curve/exchange.js --pool $CURVE_POOL_ADDR --key $ACC_PRIV_KEY --amount 1000 --from 0 --to 2
```
> Note that the `from` & `to` params are the INDEX of the coin from the list of supported coins in the pool.
> This list can be found using the pool info tool.

#### Kill
```
node ./tools/curve/kill.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/curve/kill.js --pool $CURVE_POOL_ADDR
```

#### Unkill
```
node ./tools/curve/unkill.js -h
```
> Make sure you are in the root of the repo

```
node ./tools/curve/unkill.js --pool $CURVE_POOL_ADDR
```


### Deploy
#### Localnet / Testnet Deploy
```
node ./tools/deploy/test/deploy.js
```
> This will deploy the Curve LP contract as well as 3 HRC20 tokens that are part of the pool.
>
> All addresses will be saved in `./tools/deploy/test/addresses.json`  

#### Localnet / Testnet Basic Checks
```
node ./tools/deploy/test/checks.js
```
> This will mint some test tokens on each of the 3 test HRC20 tokens, 
> then add to the LP, exchange, and remove from the LP.

## Copyright
All contracts were sourced from curve.fi and modified for minimal functionality and compatibility on Harmony.