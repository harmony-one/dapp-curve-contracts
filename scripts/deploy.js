require('dotenv').config()
const assert = require("assert")
const erc20 = require(__dirname + "/../build/contracts/ERC20.json")

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

// TODO: check minter call
function setERC20Minter(minterAddress, contractAddress, hmy) {
    let contract = hmy.contracts.createContract(erc20.abi, contractAddress)
    contract.methods.set_minter().call(minterAddress, gasParams).then(console.log).catch(console.error)
}

function logERC20Name(contractAddress, hmy) {
    let contract = hmy.contracts.createContract(erc20.abi, contractAddress)
    contract.methods.name().call(gasParams).then(console.log).catch(console.error)
}

initHmy().then((hmy) => {
    assert(hmy.wallet.accounts.length > 0)

    let deployAddrs = {}

    deploy(hmy, erc20, ["curve-test-A", "A", 18, Math.pow(10, 9)]).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-a")
        logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-B", "B", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-b")
        logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-C", "C", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-c")
        logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-pool", "P", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20-pool")
        logERC20Name(response.transaction.receipt.contractAddress, hmy)
    }).then(() => {process.exit()})
})
