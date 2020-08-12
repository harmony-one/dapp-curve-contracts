#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "$DIR/../"

bash "$DIR/setup.sh"

if [ "$1" == "fund" ]; then
  node "$DIR/../tools/tokens/fund.js" --file /tmp/fund.csv "${@:2}"
  exit 0
fi

/bin/bash