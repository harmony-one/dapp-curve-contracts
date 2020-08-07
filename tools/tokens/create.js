// Test script to mint tokens, assumes environment is setup
// and script is called from root of the repo.
// Note that the account from the MNEMONIC given on setup needs
// to be the token minter.


require('dotenv').config()
const assert = require("assert")
const yargs = require('yargs');
const argv = yargs.option('token', {
    alias: 't',
    description: 'The contract address for the HRC20 token',
    type: 'string'
}).option('address', {
    alias: 'a',
    description: 'The address of the account (hex or bec32) to spend the minted tokens',
    type: 'string'
}).option('amount', {
    alias: 'n',
    description: 'The amount to mint',
    type: 'float'
}).help().alias('help', 'h').argv;

if (argv.token == null || argv.address == null || argv.amount == null) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

const erc20 = require(__dirname + "/../../build/contracts/ERC20.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}
const { fromBech32 } = require("@harmony-js/crypto");
let initHmy = require('../hmy')

initHmy().then((hmy) => {
    console.log("Minting " +  argv.amount + " token(s) for " + argv.address + " on " + argv.token)

    let account = argv.address
    if (account.startsWith("one1")){
        account = fromBech32(account, "one")
    }

    let contract = hmy.contracts.createContract(erc20.abi, argv.token)
    contract.methods.mint(account, argv.amount).send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log( JSON.stringify(resp.transaction.receipt, null, 2))
        return contract.methods.balanceOf(account).call(gasParams)
    }).then((resp) => {
        console.log("Balance for " + argv.address + " on " + argv.token + ": " + resp.toString())
    }).then(() => {
        process.exit(0)
    }).catch(console.error)
})