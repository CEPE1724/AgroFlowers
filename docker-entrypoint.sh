#!/bin/sh
set -e

node ./dist/server/entry.mjs &

exec nginx -g "daemon off;"
