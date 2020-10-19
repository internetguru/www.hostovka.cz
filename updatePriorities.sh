#!/bin/bash

while read -r line; do
  link="$(echo "$line" | cut -d, -f1)"
  fname="plugins/Agregator/clanky/${link##/}.html"
  views="$(echo "$line" | cut -d, -f2)"
  [[ -f "$fname" ]] \
    || continue
  echo "${views// /}"
  sed -i 's/data-top="[^"]\+" //' "$fname"
  sed -i "s/ctime/data-top=\"$views\" ctime/" "$fname"
done < "analytics.csv"

