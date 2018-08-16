#!/bin/bash

if [ ! -d "node_modules" ]; then
  echo "Installing NPM packages"
  npm install
fi

echo "Creating installer for application"
npm run package-mac
npm run create-installer-mac
open ./release-builds/k8s-value-editor.dmg

