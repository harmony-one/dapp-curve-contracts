// Test script to fund tokens given a CSV, assumes environment is setup
// and script is called from root of the repo.
// Note that the account from the MNEMONIC given on setup needs
// to be the token minter.

require('dotenv').config()
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const assert = require("assert");
const BN = require('bn.js');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const precision = 1e18

const yargs = require('yargs');
const argv = yargs.option('token', {
    alias: 't',
    description: 'The contract address for the HRC20 token',
    type: 'string'
}).option('file', {
    alias: 'f',
    description: 'Path to the CSV file to fund.',
    type: 'string'
}).option('method', {
    alias: 'm',
    description: 'Method of funding: mint, transfer',
    ype: 'string'
}).help().alias('help', 'h').argv;

if (argv.token == null || argv.file == null || (argv.method !== "mint" && argv.method !== "transfer") ) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

const erc20 = require(__dirname + "/../../build/contracts/ERC20.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}
const { fromBech32 } = require("@harmony-js/crypto");
let initHmy = require('../hmy')

function parseCsv() {
    return new Promise(function(resolve, reject) {
        let data = []
        fs.createReadStream(path.resolve(argv.file))
            .pipe(csv.parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => {
                let newRow = {}
                if (!row.to || !row.amount){
                    return
                }
                if (row.to.startsWith("one1")){
                    newRow.to = fromBech32(row.to, "one")
                }
                newRow.amount = new BN(`${row.amount * precision}`)
                data.push(newRow)
                console.log(`account: ${row.to}\tamount: ${row.amount}`)
            })
            .on('end', rowCount => {
                console.log(`Parsed ${rowCount} rows`)
                resolve(data)
            })
    })
}

async function fund_account(account, hmy) {
    let contract = hmy.contracts.createContract(erc20.abi, argv.token)
    console.log(`Funding ${account.to} ${account.amount * 1e-18} tokens`)

    let fund
    if (argv.method === "mint") {
        fund = contract.methods.mint(account.to, account.amount).send(gasParams)
    } else {
        fund = contract.methods.transfer(account.to, account.amount).send(gasParams)
    }

    await fund.then((resp) => {
        assert(resp.status === "called")
        console.log( JSON.stringify(resp.transaction.receipt, null, 2))
        return contract.methods.balanceOf(account.to).call(gasParams)
    }).then((resp) => {
        console.log("Balance for " + account.to + " is: " + resp + " units (no decimal correction)")
    })
}

async function fund(accounts, hmy){
    await new Promise(function(resolve, reject) {
        readline.question(`Fund ${accounts.length} accounts? (y/n)\n> `, resp => {
            if (!resp.toLowerCase().startsWith("y")) {
                throw new Error("Rejected Funding...")
            }
            readline.close();
            resolve()
        });
    })

    for(let i = 0; i < accounts.length; i ++){
        await fund_account(accounts[i], hmy)
    }
}

initHmy().then((hmy) => {
    console.log("Funding tokens from: " + argv.file)
    parseCsv().then((lst) => {
        return lst
    }).then((lst) => {
        return fund(lst, hmy)
    }).then(() => {
        console.log("Funding done!")
        process.exit(0)
    }).catch(console.log)
})