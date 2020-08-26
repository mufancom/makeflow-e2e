#!/usr/bin/env bash

set -e

${BASH_SOURCE%/*}/update-metadata.sh $1

yarn --silent inplate --update
