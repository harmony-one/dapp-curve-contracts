// Test script will fetch common info/stats of the curve liquidity pool.
// Assumes environment is setup and script is called from root of the repo.

require('dotenv').config()
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
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x66691b7}
let initHmy = require('../hmy')


async function getStats(hmy) {
    let swap = hmy.contracts.createContract(stableswap.abi, argv.pool)
    let data = {}

    data["coin_addr"] = [
        await swap.methods.coins(0).call(gasParams),
        await swap.methods.coins(1).call(gasParams),
        await swap.methods.coins(2).call(gasParams)
    ]
    data["underlying_coin_addr"] = [  // unused
        await swap.methods.underlying_coins(0).call(gasParams),
        await swap.methods.underlying_coins(1).call(gasParams),
        await swap.methods.underlying_coins(2).call(gasParams)
    ]
    data["balances"] = [
        (await swap.methods.balances(0).call(gasParams)).toString(),
        (await swap.methods.balances(1).call(gasParams)).toString(),
        (await swap.methods.balances(2).call(gasParams)).toString()
    ]
    data["A"] = (await swap.methods.A().call(gasParams)).toString()
    data["fee"] = (await swap.methods.fee().call(gasParams)).toString()
    data["owner"] = await swap.methods.owner().call(gasParams)
    data["virtual_price"] = (await swap.methods.get_virtual_price().call(gasParams)).toString()
    data["token_address"] = await swap.methods.tokenAddress().call(gasParams)
    return data
}


initHmy().then((hmy) => {
    getStats(hmy).then((resp) => {
        console.log( JSON.stringify(resp, null, 2))
    }).then(() => {
        process.exit(0)
    }).catch(console.error)
})