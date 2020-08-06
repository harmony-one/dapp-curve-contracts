const fs = require('fs');
const assert = require("assert")
const erc20 = require(__dirname + "/../build/contracts/ERC20.json")
const stableswap = require(__dirname + "/../build/contracts/Stableswap.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}

let initHmy = require('../src/deploy_harmony')
let addresses = require(__dirname + "/../deploy/contracts/addresses.json")
let testAcc1 = "0xd1FBb526A239E2A9Ae2Da5b295E0482a098A1a0e"  // one168am2f4z8832nt3d5keftczg9gyc5xsw8e25q5
let testAcc1M = "picture blue version tube vivid sniff quick next expand need mesh aerobic excess initial mosquito govern limit quick wrestle shiver enemy exotic mother diamond"
let testAcc2 = "0xd0284d8B2BCEb1801cfe6B58340ce547D177829c"  // one16q5ymzete6ccq887ddvrgr89glgh0q5u8uu4mv
let testAcc2M = "brief secret knee shield obscure inflict mansion palace awful observe legal person curious arctic budget piece arena census edit miracle tell stereo shaft aisle"


async function fund(hmy)  {
    // return  // for debugging...

    console.log("Minting test tokens...")
    let contract_ercA = hmy.contracts.createContract(erc20.abi, addresses.erc20_a)
    let contract_ercB = hmy.contracts.createContract(erc20.abi, addresses.erc20_b)
    let contract_ercC = hmy.contracts.createContract(erc20.abi, addresses.erc20_c)

    console.log("minting for " + testAcc1 + " on " + addresses.erc20_a)
    await contract_ercA.methods.mint(testAcc1, 1e10).send(gasParams).then((resp) => {
        return contract_ercA.methods.balanceOf(testAcc1).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc1 + " on " + addresses.erc20_a + " : " + resp.toNumber())
    }).then(() => {
        console.log("minting for " + testAcc1 + " on " + addresses.erc20_b)
        return contract_ercB.methods.mint(testAcc1, 1e10).send(gasParams)
    }).then((resp) => {
        return contract_ercB.methods.balanceOf(testAcc1).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc1 + " on " + addresses.erc20_a + " : " + resp.toNumber())
    }).then(() => {
        console.log("minting for " + testAcc1 + " on " + addresses.erc20_c)
        return contract_ercC.methods.mint(testAcc1, 1e10).send(gasParams)
    }).then((resp) => {
        return contract_ercC.methods.balanceOf(testAcc1).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc1 + " on " + addresses.erc20_c + " : " + resp.toNumber())
    })
}

async function testStableSwap(hmy) {
    console.log("Starting stable swap test...")
    let deploySigner = hmy.wallet.signer
    let contract_ercA = hmy.contracts.createContract(erc20.abi, addresses.erc20_a)
    let contract_ercB = hmy.contracts.createContract(erc20.abi, addresses.erc20_b)
    let contract_ercC = hmy.contracts.createContract(erc20.abi, addresses.erc20_c)
    let contract_ercPool = hmy.contracts.createContract(erc20.abi, addresses.erc20_pool)
    let swap = hmy.contracts.createContract(stableswap.abi, addresses.stableswap)
    let coins = [
        await swap.methods.coins(0).call(gasParams),
        await swap.methods.coins(1).call(gasParams),
        await swap.methods.coins(2).call(gasParams)
    ]
    assert(coins[0].toLowerCase() === addresses.erc20_a.toLowerCase())
    assert(coins[1].toLowerCase() === addresses.erc20_b.toLowerCase())
    assert(coins[2].toLowerCase() === addresses.erc20_c.toLowerCase())

    // === Test adding liquidity ===
    console.log("Testing adding liquidity...")
    hmy.wallet.addByMnemonic(testAcc1M)
    hmy.wallet.setSigner(testAcc1)

    let initTestBalances = [
        (await contract_ercA.methods.balanceOf(testAcc1).call(gasParams)).toNumber(),
        (await contract_ercB.methods.balanceOf(testAcc1).call(gasParams)).toNumber(),
        (await contract_ercC.methods.balanceOf(testAcc1).call(gasParams)).toNumber()
    ]

    let approve1 = await contract_ercA.methods.approve(addresses.stableswap, 100).send(gasParams)
    let allow1 = (await contract_ercA.methods.allowance(testAcc1, addresses.stableswap).call(gasParams)).toNumber()
    assert(approve1.status === "called")
    assert(allow1 >= 10)
    let approve2 = await contract_ercB.methods.approve(addresses.stableswap, 100).send(gasParams)
    let allow2 = (await contract_ercB.methods.allowance(testAcc1, addresses.stableswap).call(gasParams)).toNumber()
    assert(approve2.status === "called")
    assert(allow2 >= 10)
    let approve3 = await contract_ercC.methods.approve(addresses.stableswap, 100).send(gasParams)
    let allow3 = (await contract_ercC.methods.allowance(testAcc1, addresses.stableswap).call(gasParams)).toNumber()
    assert(approve3.status === "called")
    assert(allow3 >= 10)
    console.log("Successfully approved token transfer for adding liquidity")

    await swap.methods.add_liquidity([10, 10, 10], 0).send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log("Added test liquidity for account " + testAcc1 + " response: "
            + JSON.stringify(resp.transaction.receipt, null, 2))
    })
    console.log("Successfully added liquidity")

    let postTestBalances = [
        (await contract_ercA.methods.balanceOf(testAcc1).call(gasParams)).toNumber(),
        (await contract_ercB.methods.balanceOf(testAcc1).call(gasParams)).toNumber(),
        (await contract_ercC.methods.balanceOf(testAcc1).call(gasParams)).toNumber()
    ]

    for (let i = 0; i < initTestBalances.length; i++){
        assert((initTestBalances[i] - 10) === postTestBalances[i])
    }
    console.log("Successfully checked balance changes")

    let poolTokenBalance = (await contract_ercPool.methods.balanceOf(testAcc1).call(gasParams)).toNumber()
    assert(poolTokenBalance > 0)
    console.log("Successfully checked pool token balance: " + poolTokenBalance)


    // === Test exchange ===
    console.log("Testing exchange...")
}


initHmy().then((hmy) => {
    fund(hmy).then(() => {
        console.log("Funding done...")
    }).then(() => {
        return testStableSwap(hmy)
    }).then(() => {

    })
})