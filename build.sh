#!/bin/bash

HOST="http:\/\/nolancaudill.com\/machinetaggeo"
HOST="http:\/\/localhost\/machinetaggeo\/build"

if [ -z "$YUICOMPRESSOR" ] 
    then
    echo "Need to add YUICOMPRESSOR to shell config"
    exit
fi

echo "Moving all files over to build dir..."
rm -rf build
mkdir build
cp -R src/* build/

echo "Filling in variables..."
sed "s/BUILD_URL_ROOT/$HOST/g" src/bookmarklet.js > build/bookmarklet.js
sed "s/BUILD_URL_ROOT/$HOST/g" src/machinetaggeo.js > build/machinetaggeo.js

echo "Minifying bookmarklet.js..."
cd build
java -jar "$YUICOMPRESSOR" -o bookmarklet-min.js bookmarklet.js
echo "Minifying machinetaggeo.js..."
java -jar "$YUICOMPRESSOR" -o machinetaggeo-min.js machinetaggeo.js
echo "Complete!"

