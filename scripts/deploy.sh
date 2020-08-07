#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

mkdir -p "$DIR/../build/contracts"
cd "$DIR/../contracts/"
erc20="{\"abi\": $(vyper --evm-version byzantium -f abi ERC20.vy), \"bytecode\": \"$(vyper --evm-version byzantium -f bytecode ERC20.vy)\"}"
echo "$erc20" > "$DIR/../build/contracts/ERC20.json"
erc20="{\"abi\": $(vyper --evm-version byzantium -f abi Stableswap.vy), \"bytecode\": \"$(vyper --evm-version byzantium -f bytecode Stableswap.vy)\"}"
echo "$erc20" > "$DIR/../build/contracts/Stableswap.json"
cd "$DIR/../"

if [ -z "$1" ]; then
  node "$DIR/../tools/deploy/test/deploy.js"
else
  node "$DIR/../tools/deploy/mainnet/deploy.js"
fi