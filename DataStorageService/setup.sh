#!/bin/bash

cd $(dirname $0)

SCRIPT='"use strict";
const dependencies = require("./package.json").dependencies;
const packages = [];

for (let name in dependencies) {
    packages.push(`${name}@${dependencies[name]}`);
}
process.stdout.write(packages.join(" "));
'

echo "$SCRIPT" > script.js
PACKAGES=$(node script.js)
rm script.js

npm install -g $PACKAGES

SERVICE_NAME="DataStorageService"
SERVICE_PATH="../service/$SERVICE_NAME"

if [ ! -d "$SERVICE_PATH" ]
then
    mkdir $SERVICE_PATH
fi

#need a way to compile into single file
cp -r src/* $SERVICE_PATH
