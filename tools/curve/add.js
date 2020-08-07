// Test script to add liquidity to the pool, assumes environment is setup
// and script is called from root of the repo.

require('dotenv').config()
const assert = require("assert")
const yargs = require('yargs');
const argv = yargs.option('pool', {
    alias: 'c',
    description: 'The curve liquidity pool contract address',
    type: 'string'
}).option('key', {
    alias: 'k',
    description: 'The private key of the account that is contributing to the liquidity pool',
    type: 'string'
}).option('amount', {
    alias: 'n',
    description: 'The number of tokens to contribute FOR EACH coin in the liquidity pool',
    type: 'float'
}).help().alias('help', 'h').argv;

if (argv.pool == null || argv.key == null || argv.amount == null) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

const stableswap = require(__dirname + "/../../build/contracts/Stableswap.json")
const { toBech32 } = require("@harmony-js/crypto");
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}
let initHmy = require('../hmy')

initHmy().then((hmy) => {
    let acc = hmy.wallet.addByPrivateKey(argv.key)
    hmy.wallet.setSigner(acc.address)
    console.log("Using account: " + toBech32(acc.address, "one1"))

    let swap = hmy.contracts.createContract(stableswap.abi, argv.pool)
    swap.methods.add_liquidity([argv.amount, argv.amount, argv.amount], 0).send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log( JSON.stringify(resp.transaction.receipt, null, 2))
        console.log("Added liquidity to " + argv.pool)
    }).then(() => {
        process.exit(0)
    }).catch(console.error)
})