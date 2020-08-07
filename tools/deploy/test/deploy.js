require('dotenv').config()
const fs = require('fs');
const assert = require("assert")
const erc20 = require(__dirname + "/../../../build/contracts/ERC20.json")
const stableswap = require(__dirname + "/../../../build/contracts/Stableswap.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}

let initHmy = require('../../hmy')

function deploy(hmy, contractBuildJson, args) {
    let contract = hmy.contracts.createContract(contractBuildJson.abi);
    let options3 = {data: contractBuildJson.bytecode, arguments: args};
    return contract.methods.contractConstructor(options3).send(gasParams)
}

function checkAndRecord(response, deployAddrs, name) {
    if (response.transaction.txStatus === "REJECTED") {
        console.log("Reject tx: " + response.transaction.error.message);
        process.exit(0);
    }
    console.log(
        "\nContract for " + name + " deployed: " +
        JSON.stringify(response.transaction.receipt, null, 2) + "\n"
    );
    deployAddrs[name] = response.transaction.receipt.contractAddress
}

async function setERC20Minter(minterAddress, contractAddress, hmy) {
    let contract = hmy.contracts.createContract(erc20.abi, contractAddress)
    await contract.methods.set_minter(minterAddress).send(gasParams).then((resp) => {
        console.log("Minter for " + contractAddress + " is " + minterAddress + " response: "
            + JSON.stringify(resp.transaction.receipt, null, 2))
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

    console.log("=== Starting Deploy ===")

    deploy(hmy, erc20, ["curve-test-A", "A", 8, Math.pow(18, 3)]).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_a")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-B", "B", 8, Math.pow(10, 3)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_b")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-C", "C", 8, Math.pow(10, 3)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_c")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-pool", "P", 8, 0])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_pool")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        let coins = [deployAddrs.erc20_a, deployAddrs.erc20_b, deployAddrs.erc20_c]
        let A = 66
        let fee = 1
        return deploy(hmy, stableswap, [coins, coins, deployAddrs.erc20_pool, A, fee])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "stableswap")
        return setERC20Minter(response.transaction.receipt.contractAddress, deployAddrs.erc20_pool, hmy)
    }).then(() => {
        console.log("\nDeployed Addresses" + JSON.stringify(deployAddrs, null, 2))
        let path = __dirname + "/addresses.json"
        fs.writeFileSync(path, JSON.stringify(deployAddrs))
        console.log("Saved deployed addresses at " + path)
        return new Promise(r => setTimeout(r, 8000));
    }).then(() => {
        process.exit()
    })
})