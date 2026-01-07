#!/bin/sh
mkdir -p output
cp -R ./* ./output/ 2>/dev/null || true
cp -R ./.github ./output/ 2>/dev/null || true
cp -R ./.husky ./output/ 2>/dev/null || true
rm -rf ./output/.git
rm -rf ./output/output
rm -rf ./output/node_modules