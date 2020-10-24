require('dotenv').config()
const fs = require('fs');
const assert = require("assert")
const erc20 = require(__dirname + "/../../../build/contracts/ERC20.json")
const stableswap = require(__dirname + "/../../../build/contracts/Stableswap.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}
const { toBech32 } = require("@harmony-js/crypto");
const defaultContractAddr = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

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
    let deployAddrRecord = {
        "deployer": toBech32(hmy.wallet.signer.address, "one1"),
    }

    let coins = [
        "0x8BB676F403ff1BcbEB89497457F94C9b9484497d", //1DAI
        "0xb839AA1E4c9634931749B4e46b80E3798ecf9563", //hUSDT
        "0xEFA639964F44C02aC0fD5795C6623726C7DD41cf",//hBUSD
        "0x6689F57AD16c374783585ba2C77F5316789886F2",
    ]
    let A = 85
    let fee = 1e8

    console.log("=== Starting Deploy ===")

    deploy(hmy, erc20, ["Curve.fi 1DAI/hUSDC/hUSDT/1USDC", "1DAI + hUSDC + hUSDT + 1USDC", 18, 0]).then((response) => {
        checkAndRecord(response, deployAddrRecord, "token_contract")
        return response
    }).then((response) => {
        let contractAddr = response.transaction.receipt.contractAddress
        return logERC20Name(contractAddr, hmy)
    }).then(() => {
        return deploy(hmy, stableswap, [
            coins, [defaultContractAddr, defaultContractAddr, defaultContractAddr,defaultContractAddr],
            deployAddrRecord.token_contract, A, fee
        ])
    }).then((response) => {
        checkAndRecord(response, deployAddrRecord, "stableswap_contract")
        return setERC20Minter(response.transaction.receipt.contractAddress, deployAddrRecord.token_contract, hmy)
    }).then(() => {
        console.log("\nDeployed Addresses" + JSON.stringify(deployAddrRecord, null, 2))
        let path = __dirname + "/addresses.json"
        fs.writeFileSync(path, JSON.stringify(deployAddrRecord))
        console.log("Saved deployed addresses at " + path)
        return new Promise(r => setTimeout(r, 2000));
    }).then(() => {
        process.exit()
    }).catch(console.error)
})