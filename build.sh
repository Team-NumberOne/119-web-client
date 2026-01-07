#!/bin/sh
mkdir -p output
cp -R ./* ./output/ 2>/dev/null || true
cp -R ./.github ./output/ 2>/dev/null || true
cp -R ./.husky ./output/ 2>/dev/null || true
# .npmrc.example을 복사하여 preinstall 스크립트가 작동하도록 함
if [ -f .npmrc ]; then
  cp .npmrc ./output/.npmrc 2>/dev/null || true
fi
rm -rf ./output/.git
rm -rf ./output/output
rm -rf ./output/node_modules