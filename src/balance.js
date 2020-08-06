require('dotenv').config()
const path = require('path')
const fs = require('fs')
const erc20 = require(__dirname + "/../build/contracts/ERC20.json")
const { HarmonyAddress } = require('@harmony-js/crypto');
let initHmy = require('../src/deploy_harmony')

const gasParams = { gasPrice: 0x4a817c800, gasLimit: 0x6691b7}
const baseDecimal = 1e18

function loadHRCContracts(hmy) {
    let jsonFile = path.join(__dirname, '..', 'deployed', process.env.NETWORK + '.json')
    let jsonStr = fs.readFileSync(jsonFile)
    let addrs = JSON.parse(jsonStr.toString())

    let tokens = []
    addrs.forEach((addr) => {
        tokens.push(hmy.contracts.createContract(erc20.abi, addr))
    })
    return tokens
}

async function getNameAndBalance(hmy, account, hrcToken) {
    let ecAddr = '0x'+account.basic
    let name = await hrcToken.methods.name().call(gasParams)
    let balance = await hrcToken.methods.balanceOf(ecAddr).call(gasParams)
    return [name, balance.toNumber()]
}

async function getBalances(hmy, account, tokens) {
    let promises = []
    for (let token of tokens) {
        promises.push(getNameAndBalance(hmy, account, token))
    }
    return Promise.all(promises)
}

function parseInputAccount() {
    if (process.argv.length < 3) {
        console.log("Usage:\n\tnode balance.js [one_address]")
        process.exit(1)
    }
    let raw = process.argv[2]
    if (!HarmonyAddress.isValidBech32(raw)) {
        console.log("Invalid one address: ", raw)
    }
    return new HarmonyAddress(raw)
}

initHmy().then( (hmy) => {
    let account = parseInputAccount()
    let tokens = loadHRCContracts(hmy)
    return getBalances(hmy, account, tokens)
}).then( (results) => {
    results.forEach( (res) => {
        console.log("%s:\t%d", res[0], res[1]/baseDecimal)
    })
    process.exit(0)
}).catch( (err) => {
    console.log(err)
    process.exit(1)
})



