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
echo "[setup] Enter Gas Price for all Contract Deployment (suggested: 1000000000): "
read -r gasprice
if [ -z "$mnemonic" ]; then echo "no gas price provided" && exit 1; fi
echo "[setup] Gas Price: $gasprice"
echo "[setup] Enter Gas Limit for all Contract Deployment (suggested: 6721900): "
read -r gaslimit
if [ -z "$mnemonic" ]; then echo "no gas limit provided" && exit 1; fi
echo "[setup] Gas Limit: $gaslimit"
echo "[setup] Enter Network (testnet, mainnet, localnet): "
read -r network
if [ -z "$mnemonic" ]; then echo "no network provided" && exit 1; fi
echo "[setup] network: $network"
echo "MNEMONIC='$mnemonic'
GASLIMIT=$gaslimit
GASPRICE=$gasprice
SHARD=$shard
NETWORK=$network
" > $DIR/../.env
