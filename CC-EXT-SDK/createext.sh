#!/bin/bash

BASEDIR=$(dirname "$0")
EXTDIR=~/Library/Application\ Support/Adobe/CEPServiceManager4/extensions

#create extensions folder if does not exist
mkdir -p $EXTDIR

#copy template specified in 1st arg to destination specified in 2nd arg
cp -r "$BASEDIR/templates/$1/" "$EXTDIR/$2"

#return resulting path
echo "$EXTDIR/$2"