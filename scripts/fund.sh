#!/usr/bin/env bash

TOKEN=
FILEPATH=
MINT=false

while getopts t:f:m opt
do
   case "${opt}" in
   t) TOKEN="${OPTARG}";;
   f) FILEPATH="${OPTARG}";;
   m) MINT=true;;
   *)
     echo "HRC20 Funding script

     Option:        Help:
     -t <address>   The address of the HRC20 token
     -f <path>      The file path of the CSV file of accounts to be funded & their amounts
     -m             Use minting instead of transfers (requires access to minter account)
     "
     exit 0
  esac
done

if [ ! -f "$FILEPATH" ]; then
  echo "$FILEPATH is not a path to a valid file"
  exit 1
fi

if [ -z "$TOKEN" ]; then
  echo "Token address not provided"
  exit 1
fi

#docker pull harmonyone/curve

if [ "$MINT" == "true" ]; then
  docker run -it -v "$(realpath "$FILEPATH"):/tmp/fund.csv" harmonyone/curve fund -t "$TOKEN" -m mint
else
  docker run -it -v "$(realpath "$FILEPATH"):/tmp/fund.csv" harmonyone/curve fund -t "$TOKEN" -m transfer
fi
