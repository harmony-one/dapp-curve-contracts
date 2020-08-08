// Test script to kill the pool, assumes environment is setup
// and script is called from root of the repo.

require('dotenv').config()
const assert = require("assert")
const yargs = require('yargs');
const argv = yargs.option('pool', {
    alias: 'c',
    description: 'The curve liquidity pool contract address',
    type: 'string'
}).help().alias('help', 'h').argv;

if (argv.pool == null) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

const stableswap = require(__dirname + "/../../build/contracts/Stableswap.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}
let initHmy = require('../hmy')

initHmy().then((hmy) => {
    let swap = hmy.contracts.createContract(stableswap.abi, argv.pool)
    swap.methods.unkill_me().send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log( JSON.stringify(resp.transaction.receipt, null, 2))
        console.log("Killed pool...")
    }).then(() => {
        process.exit(0)
    }).catch(console.error)
})