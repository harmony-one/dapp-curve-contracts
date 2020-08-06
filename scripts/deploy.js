require('dotenv').config()
const assert = require("assert")
const erc20 = require(__dirname + "/../build/contracts/ERC20.json")
const stableswap = require(__dirname + "/../build/contracts/Stableswap.json")

let initHmy = require('../src/deploy_harmony')

const gasParams = { gasPrice: 0x4a817c800, gasLimit: 0x6691b7}

function deploy(hmy, contractBuildJson, args) {
    let contract = hmy.contracts.createContract(contractBuildJson.abi);
    let options3 = {data: contractBuildJson.bytecode, arguments: args};
    return contract.methods.contractConstructor(options3).send(gasParams)
}

function checkAndRecord(response, deployAddrs, name){
    if (response.transaction.txStatus === "REJECTED") {
        console.log("Reject tx: " + response.transaction.error.message);
        process.exit(0);
    }
    console.log(
        "contract for " + name + " deployed: " +
        JSON.stringify(response.transaction.receipt,null, 2)
    );
    deployAddrs[name] = response.transaction.receipt.contractAddress
}

async function setERC20Minter(minterAddress, contractAddress, hmy) {
    let contract = hmy.contracts.createContract(erc20.abi, contractAddress)
    await contract.methods.set_minter(minterAddress).call(gasParams).then((resp) => {
        console.log("Minter for " + contractAddress + " is " + resp)
    }).catch(console.error)
}

async function logERC20Name(contractAddress, hmy) {
    let contract = hmy.contracts.createContract(erc20.abi, contractAddress)
    await contract.methods.name().call(gasParams).then((resp) => {
        console.log("ERC20 name for " + contractAddress + " is " + resp)
    }).catch(console.error)
}

initHmy().then((hmy) => {
    assert(hmy.wallet.accounts.length > 0)

    let deployAddrs = {}

    console.log("\n")
    deploy(hmy, erc20, ["curve-test-A", "A", 18, Math.pow(10, 9)]).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-a")
        return response
    }).then((response) => {
        return logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {
        console.log("\n")
        return deploy(hmy, erc20, ["curve-test-B", "B", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-b")
        return response
    }).then((response) => {
        return logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {
        console.log("\n")
        return deploy(hmy, erc20, ["curve-test-C", "C", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-c")
        return response
    }).then((response) => {
        return logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {
        console.log("\n")
        return deploy(hmy, erc20, ["curve-test-pool", "P", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-pool")
        return response
    }).then((response) => {
        return logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {

    }).then(() => {process.exit()})
})
