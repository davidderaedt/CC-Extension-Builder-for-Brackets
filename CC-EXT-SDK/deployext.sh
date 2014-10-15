#!/bin/bash

#create extensions folder if does not exist
mkdir -p ~/Library/Application\ Support/Adobe/CEP/extensions

#copy source folder to destination with specified ID
cp -r -X "$1" ~/Library/Application\ Support/Adobe/CEP/extensions/$2

#return resulting path
echo ~/Library/Application\ Support/Adobe/CEP/extensions/$2