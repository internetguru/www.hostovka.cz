#!/bin/bash

cnt=1000
declare -i i
while read -r line; do
  link="$(echo "$line" | cut -d, -f1)"
  fname="plugins/Agregator/clanky/${link##/}.html"
  [[ -f "$fname" ]] \
    || continue
  i+=1
  priority=$(( cnt - i ))
  sed -i 's/data-top="[^"]\+" //' "$fname"
  sed -i "s/ctime/data-top=\"$priority\" ctime/" "$fname"
done < "analytics.csv"

