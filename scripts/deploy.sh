#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

mkdir -p "$DIR/../build/contracts"
mkdir -p "$DIR/../deploy/contracts"
node "$DIR/deploy.js"
