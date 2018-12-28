#!/bin/bash
# a script to recursively find and copy files to a desired location
find ./ -type f -iname 'Tiny*.nupkg' -print0 |
while IFS= read -r -d '' f; 
do cp -- "$f" ~/LocalNugets ;
done