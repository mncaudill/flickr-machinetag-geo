#!/bin/bash

HOST="http:\/\/nolancaudill.com\/machinetaggeo"
HOST="http:\/\/localhost\/machinetaggeo\/build"

if [ -z "$YUICOMPRESSOR" ] 
    then
    echo "Need to add YUICOMPRESSOR to shell config"
    exit
fi

if [ ! -d build ]
    then
    mkdir build
fi

echo "Moving all files over to build dir..."
cp -R src/* build/

echo "Filling in variables..."
sed "s/BUILD_URL_ROOT/$HOST/g" src/bookmarklet.js > bookmarklet-tmp.js
sed "s/BUILD_URL_ROOT/$HOST/g" src/machinetaggeo.js > machinetaggeo-tmp.js

echo "Minifying bookmarklet.js..."
java -jar "$YUICOMPRESSOR" -o build/bookmarklet-min.js bookmarklet-tmp.js
rm bookmarklet-tmp.js
echo "Minifying machinetaggeo.js..."
java -jar "$YUICOMPRESSOR" -o build/machinetaggeo-min.js machinetaggeo-tmp.js
rm machinetaggeo-tmp.js
echo "Complete!"

