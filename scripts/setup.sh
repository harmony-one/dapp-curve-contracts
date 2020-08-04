#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo -e "[setup] Enter contract deployer wallet mnemonic: \n> "
read -r mnemonic
echo "[setup] Mnemonic: $mnemonic"
echo -e "[setup] Enter ShardID (0,1,2,3): \n> "
read -r shard
echo "[setup] ShardID: $shard"
echo -e "[setup] Enter Gas Price for all Contract Deployment (suggested: 1000000000): \n>"
read -r gasprice
echo "[setup] Gas Price: $gasprice"
echo -e "[setup] Enter Gas Limit for all Contract Deployment (suggested: 6721900): \n> "
read -r gaslimit
echo "[setup] Gas Limit: $gaslimit"
echo -e "[setup] Enter Network (testnet, mainnet, localnet): \n> "
read -r network
echo "[setup] network: $network"
echo "MNEMONIC='$mnemonic'
GASLIMIT=$gaslimit
GASPRICE=$gasprice
SHARD=$shard
NETWORK=$network
" > $DIR/../.env
