// Test script to swap stable coins using curve's liquidity pool.
// Assumes environment is setup and script is called from root of the repo.

require('dotenv').config()
const assert = require("assert")
const yargs = require('yargs');
const BigNumber = require('bignumber.js');
const argv = yargs.option('pool', {
    alias: 'c',
    description: 'The curve liquidity pool contract address',
    type: 'string'
}).option('key', {
    alias: 'k',
    description: 'The private key of the account to exchanging coins',
    type: 'string'
}).option('amount', {
    alias: 'n',
    description: 'The number of pool tokens to remove from the liquidity pool',
    type: 'float'
}).option('from', {
    alias: 'i',
    description: 'The index of the coin being sold (from the LP contract coin info)',
    type: 'int'
}).option('to', {
    alias: 'j',
    description: 'The index of the coin being bought (from the LP contract coin info)',
    type: 'int'
}).help().alias('help', 'h').argv;

if (argv.pool == null || argv.key == null || argv.amount == null || argv.from == null || argv.to == null) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

const stableswap = require(__dirname + "/../../build/contracts/Stableswap.json")
const erc20 = require(__dirname + "/../../build/contracts/ERC20.json")
const { toBech32 } = require("@harmony-js/crypto");
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}
let initHmy = require('../hmy')

async function exchange(hmy) {
    let swap = hmy.contracts.createContract(stableswap.abi, argv.pool)
    let sourceCoinAddress = await swap.methods.coins(argv.from).call(gasParams)
    let coin = hmy.contracts.createContract(erc20.abi, sourceCoinAddress)
    let exchangeApprove = await coin.methods.approve(argv.pool, argv.amount).send(gasParams)
    let exchangeAllow = new BigNumber((await coin.methods.allowance(hmy.wallet.signer.address, argv.pool).call(gasParams)))
    assert(exchangeApprove.status === "called")
    assert(exchangeAllow.isGreaterThanOrEqualTo(new BigNumber(argv.amount)))
    console.log("Approved token transfer for exchange...")

    await swap.methods.exchange(argv.from, argv.to, argv.amount, 0).send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log(JSON.stringify(resp.transaction.receipt, null, 2))
    })
}

initHmy().then((hmy) => {
    let acc = hmy.wallet.addByPrivateKey(argv.key)
    hmy.wallet.setSigner(acc.address)
    console.log("Using account: " + toBech32(acc.address, "one1"))

    exchange(hmy).then(() => {
        process.exit(0)
    }).catch(console.error)
})