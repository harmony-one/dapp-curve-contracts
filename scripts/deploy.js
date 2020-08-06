require('dotenv').config()
const fs = require('fs');
const assert = require("assert")
const erc20 = require(__dirname + "/../build/contracts/ERC20.json")
const stableswap = require(__dirname + "/../build/contracts/Stableswap.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}

let initHmy = require('../src/deploy_harmony')
let testAddress1 = "0xd1FBb526A239E2A9Ae2Da5b295E0482a098A1a0e"  // one168am2f4z8832nt3d5keftczg9gyc5xsw8e25q5
let testAddress2 = "0xd0284d8B2BCEb1801cfe6B58340ce547D177829c"  // one16q5ymzete6ccq887ddvrgr89glgh0q5u8uu4mv

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

async function mintERC20(recipientAddress, contractAddress, value, hmy) {
    let contract = hmy.contracts.createContract(erc20.abi, contractAddress)
    await contract.methods.mint(recipientAddress, value).call(gasParams).then((resp) => {
        console.log("Minted " + value + " for account " + recipientAddress + " on contract " + contractAddress)
    }).catch(console.error)
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

    deploy(hmy, erc20, ["curve-test-A", "A", 18, Math.pow(10, 9)]).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_a")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        mintERC20(testAddress1, contractAddr, "1000", hmy)
        mintERC20(testAddress2, contractAddr, "2000", hmy)
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-B", "B", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_b")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        mintERC20(testAddress1, contractAddr, "1000", hmy)
        mintERC20(testAddress2, contractAddr, "2000", hmy)
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-C", "C", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_c")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        mintERC20(testAddress1, contractAddr, "1000", hmy)
        mintERC20(testAddress2, contractAddr, "2000", hmy)
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        return deploy(hmy, erc20, ["curve-test-pool", "P", 18, Math.pow(10, 9)])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "erc20_pool")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        let coins = [deployAddrs.erc20_a, deployAddrs.erc20_b, deployAddrs.erc20_c]
        let A = 300
        let fee = 0
        return deploy(hmy, stableswap, [coins, coins, deployAddrs.erc20_pool, A, fee])
    }).then((response) => {
        checkAndRecord(response, deployAddrs, "stableswap")
        return setERC20Minter(response.transaction.receipt.contractAddress, deployAddrs.erc20_pool, hmy)
    }).then(() => {
        console.log("\nDeployed Addresses" + JSON.stringify(deployAddrs, null, 2))
        let deployDir = __dirname + "/../deploy/contracts/"
        if (!fs.existsSync(deployDir)) {
            fs.mkdirSync(deployDir, {recursive: true})
        }
        let path = deployDir + "addresses.json"
        fs.writeFileSync(path, JSON.stringify(deployAddrs))
        console.log("Saved deployed addresses at " + path)
        return new Promise(r => setTimeout(r, 8000));
    }).then(() => {
        process.exit()
    })
})
