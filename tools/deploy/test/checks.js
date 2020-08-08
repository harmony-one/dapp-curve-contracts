const fs = require('fs');
const assert = require("assert")
const BigNumber = require('bignumber.js');
const erc20 = require(__dirname + "/../../../build/contracts/ERC20.json")
const stableswap = require(__dirname + "/../../../build/contracts/Stableswap.json")
const gasParams = {gasPrice: 0x4a817c800, gasLimit: 0x6691b7}

let initHmy = require('../../hmy')
let addresses = require(__dirname + "/addresses.json")
let testAcc1 = "0xd1FBb526A239E2A9Ae2Da5b295E0482a098A1a0e"  // one168am2f4z8832nt3d5keftczg9gyc5xsw8e25q5
let testAcc1M = "picture blue version tube vivid sniff quick next expand need mesh aerobic excess initial mosquito govern limit quick wrestle shiver enemy exotic mother diamond"
let testAcc2 = "0xd0284d8B2BCEb1801cfe6B58340ce547D177829c"  // one16q5ymzete6ccq887ddvrgr89glgh0q5u8uu4mv
let testAcc2M = "brief secret knee shield obscure inflict mansion palace awful observe legal person curious arctic budget piece arena census edit miracle tell stereo shaft aisle"


async function fund(hmy)  {
    console.log("Minting test tokens...")
    let mintAmount = 1e5
    let contract_ercA = hmy.contracts.createContract(erc20.abi, addresses.erc20_a)
    let contract_ercB = hmy.contracts.createContract(erc20.abi, addresses.erc20_b)
    let contract_ercC = hmy.contracts.createContract(erc20.abi, addresses.erc20_c)

    console.log("minting for " + testAcc1 + " on " + addresses.erc20_a)
    await contract_ercA.methods.mint(testAcc1, mintAmount).send(gasParams).then((resp) => {
        return contract_ercA.methods.balanceOf(testAcc1).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc1 + " on " + addresses.erc20_a + " : " + resp.toString())
    }).then(() => {
        console.log("minting for " + testAcc1 + " on " + addresses.erc20_b)
        return contract_ercB.methods.mint(testAcc1, mintAmount).send(gasParams)
    }).then((resp) => {
        return contract_ercB.methods.balanceOf(testAcc1).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc1 + " on " + addresses.erc20_a + " : " + resp.toString())
    }).then(() => {
        console.log("minting for " + testAcc1 + " on " + addresses.erc20_c)
        return contract_ercC.methods.mint(testAcc1, mintAmount).send(gasParams)
    }).then((resp) => {
        return contract_ercC.methods.balanceOf(testAcc1).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc1 + " on " + addresses.erc20_c + " : " + resp.toString())
    }).then(() => {
        console.log("minting for " + testAcc2 + " on " + addresses.erc20_a)
        return contract_ercA.methods.mint(testAcc2, mintAmount).send(gasParams)
    }).then((resp) => {
        return contract_ercA.methods.balanceOf(testAcc2).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc2 + " on " + addresses.erc20_a + " : " + resp.toString())
    }).then(() => {
        console.log("minting for " + testAcc2 + " on " + addresses.erc20_b)
        return contract_ercB.methods.mint(testAcc2, mintAmount).send(gasParams)
    }).then((resp) => {
        return contract_ercB.methods.balanceOf(testAcc2).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc2 + " on " + addresses.erc20_b + " : " + resp.toString())
    }).then(() => {
        console.log("minting for " + testAcc2 + " on " + addresses.erc20_c)
        return contract_ercC.methods.mint(testAcc2, mintAmount).send(gasParams)
    }).then((resp) => {
        return contract_ercC.methods.balanceOf(testAcc2).call(gasParams)
    }).then((resp) => {
        console.log("balance for " + testAcc2 + " on " + addresses.erc20_c + " : " + resp.toString())
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
    console.log("Testing add liquidity...")
    let liquidityAmount = 1e3
    hmy.wallet.addByMnemonic(testAcc1M)
    hmy.wallet.setSigner(testAcc1)

    let preLiquidityTestBalances = [
        new BigNumber((await contract_ercA.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercB.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercC.methods.balanceOf(testAcc1).call(gasParams)).toString())
    ]

    let approve1 = await contract_ercA.methods.approve(addresses.stableswap, liquidityAmount).send(gasParams)
    let allow1 = (await contract_ercA.methods.allowance(testAcc1, addresses.stableswap).call(gasParams)).toNumber()
    assert(approve1.status === "called")
    assert(allow1 >= liquidityAmount)
    let approve2 = await contract_ercB.methods.approve(addresses.stableswap, liquidityAmount).send(gasParams)
    let allow2 = (await contract_ercB.methods.allowance(testAcc1, addresses.stableswap).call(gasParams)).toNumber()
    assert(approve2.status === "called")
    assert(allow2 >= liquidityAmount)
    let approve3 = await contract_ercC.methods.approve(addresses.stableswap, liquidityAmount).send(gasParams)
    let allow3 = (await contract_ercC.methods.allowance(testAcc1, addresses.stableswap).call(gasParams)).toNumber()
    assert(approve3.status === "called")
    assert(allow3 >= liquidityAmount)
    console.log("Successfully approved token transfer for adding liquidity")

    await swap.methods.add_liquidity([liquidityAmount, liquidityAmount, liquidityAmount], 0).send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log("Added test liquidity for account " + testAcc1 + " response: "
            + JSON.stringify(resp.transaction.receipt, null, 2))
    })
    console.log("Successfully added liquidity")

    let postLiquidityTestBalances = [
        new BigNumber((await contract_ercA.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercB.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercC.methods.balanceOf(testAcc1).call(gasParams)).toString())
    ]

    for (let i = 0; i < preLiquidityTestBalances.length; i++){
        assert(preLiquidityTestBalances[i].minus(new BigNumber(liquidityAmount)).eq(postLiquidityTestBalances[i]))
    }
    console.log("Successfully checked balance changes")

    let poolTokenBalance = new BigNumber((await contract_ercPool.methods.balanceOf(testAcc1).call(gasParams)).toString())
    assert(poolTokenBalance.isGreaterThan(new BigNumber(0)))
    console.log("Successfully checked pool token balance for " + testAcc1 + " : " + poolTokenBalance.toString())


    // === Test exchange ===
    console.log("Testing exchange...")
    let exchangedAmount = 1e2
    hmy.wallet.addByMnemonic(testAcc2M)
    hmy.wallet.setSigner(testAcc2)

    let preExchangeTestBalances = [
        new BigNumber((await contract_ercA.methods.balanceOf(testAcc2).call(gasParams)).toString()),
        new BigNumber((await contract_ercB.methods.balanceOf(testAcc2).call(gasParams)).toString()),
        new BigNumber((await contract_ercC.methods.balanceOf(testAcc2).call(gasParams)).toString())
    ]

    let exchangeApprove = await contract_ercA.methods.approve(addresses.stableswap, exchangedAmount).send(gasParams)
    let exchangeAllow = (await contract_ercA.methods.allowance(testAcc2, addresses.stableswap).call(gasParams)).toNumber()
    assert(exchangeApprove.status === "called")
    assert(exchangeAllow >= exchangedAmount)
    console.log("Successfully approved token transfer for exchange")

    await swap.methods.exchange(0, 1, exchangedAmount, 0).send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log("Exchange token A for token B for account " + testAcc2 + " response: "
            + JSON.stringify(resp.transaction.receipt, null, 2))
    })
    console.log("Successfully exchanged tokens")

    let postExchangeTestBalances = [
        new BigNumber((await contract_ercA.methods.balanceOf(testAcc2).call(gasParams)).toString()),
        new BigNumber((await contract_ercB.methods.balanceOf(testAcc2).call(gasParams)).toString()),
        new BigNumber((await contract_ercC.methods.balanceOf(testAcc2).call(gasParams)).toString())
    ]
    assert(preExchangeTestBalances[0].minus(postExchangeTestBalances[0]).eq(new BigNumber(exchangedAmount)))
    let slipDiff = new BigNumber(exchangedAmount).minus(postExchangeTestBalances[1].minus(preExchangeTestBalances[1]))
    console.log("Resulting exchange loss: " + slipDiff.toString())
    assert(slipDiff.isLessThanOrEqualTo(preExchangeTestBalances[0].multipliedBy(new BigNumber(0.01))))
    console.log("Successfully checked balance changes")


    // === Test remove liquidity ===
    console.log("Testing remove liquidity...")
    hmy.wallet.setSigner(testAcc1)  // Signer should already be in wallet from previous test

    let preRemoveLiquidityTestBalances = [
        new BigNumber((await contract_ercA.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercB.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercC.methods.balanceOf(testAcc1).call(gasParams)).toString())
    ]
    let preRemovePoolTokenBalance = new BigNumber((await contract_ercPool.methods.balanceOf(testAcc1).call(gasParams)).toString())
    let removedAmount = BigNumber.min(poolTokenBalance, new BigNumber(1e18)).toNumber()

    await swap.methods.remove_liquidity(removedAmount, [0,0,0]).send(gasParams).then((resp) => {
        assert(resp.status === "called")
        console.log("Remove liquidity for " + testAcc1 + " response: "
            + JSON.stringify(resp.transaction.receipt, null, 2))
    })
    console.log("Successfully removed liquidity")

    let postRemoveLiquidityTestBalances = [
        new BigNumber((await contract_ercA.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercB.methods.balanceOf(testAcc1).call(gasParams)).toString()),
        new BigNumber((await contract_ercC.methods.balanceOf(testAcc1).call(gasParams)).toString())
    ]
    let postRemovePoolTokenBalance = new BigNumber((await contract_ercPool.methods.balanceOf(testAcc1).call(gasParams)).toString())
    assert(preRemovePoolTokenBalance.minus(postRemovePoolTokenBalance).eq(removedAmount))

    for (let i = 0; i < preLiquidityTestBalances.length; i++){
        assert(postRemoveLiquidityTestBalances[i].isGreaterThan(preRemoveLiquidityTestBalances[i]))
    }
    console.log("Successfully checked balance changes")
    hmy.wallet.signer = deploySigner
}


initHmy().then((hmy) => {
    fund(hmy).then(() => {
        console.log("Funding done...")
    }).then(() => {
        return testStableSwap(hmy)
    }).then(() => {
        console.log("All checks passed!")
        process.exit(0)
    })
})