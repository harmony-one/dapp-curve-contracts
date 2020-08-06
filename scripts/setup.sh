#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "[setup] Enter contract deployer wallet mnemonic: "
read -r mnemonic
if [ -z "$mnemonic" ]; then echo "no mnemonic provided" && exit 1; fi
echo "[setup] Mnemonic: $mnemonic"
echo "[setup] Enter ShardID (0,1,2,3): "
read -r shard
if [ -z "$mnemonic" ]; then echo "no shard provided" && exit 1; fi
echo "[setup] ShardID: $shard"
echo "[setup] Enter Network (testnet, mainnet, localnet): "
read -r network
if [ -z "$mnemonic" ]; then echo "no network provided" && exit 1; fi
echo "[setup] network: $network"
echo "MNEMONIC='$mnemonic'
SHARD=$shard
NETWORK=$network
" > $DIR/../.env
