var erc20 = artifacts.require("ERC20");

module.exports = function(deployer) {
  deployer.deploy(erc20, "curve-test-A", "A", 18, Math.pow(10, 9));
  deployer.deploy(erc20, "curve-test-B", "B", 18, Math.pow(10, 9));
  deployer.deploy(erc20, "curve-test-C", "C", 18, Math.pow(10, 9));
};
