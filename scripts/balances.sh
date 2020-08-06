#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ "$#" -ne 1 ]; then
  echo "Usage:
  ./scripts/balances.sh [one_account]"
  exit 1
fi

node "$DIR/../src/balance.js" $1
