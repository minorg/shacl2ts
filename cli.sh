#!/bin/sh

set -e

cd "$(dirname "$0")"

npm exec tsx -- cli.ts "$@"
