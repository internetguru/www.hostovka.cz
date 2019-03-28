#!/bin/bash
echo "--- Unique labels ---"
for f in plugins/Agregator/clanky/*.html; do
  hxselect -c "body > h + desc::attr(kw)" < "$f" \
    | tr "," $'\n' \
    | sed 's/^ *\| *$//'
  echo
done | sort -u

echo
echo "--- link-labels ---"
for f in plugins/Agregator/clanky/*.html; do
  #id="$(hxselect -c "body > h::attr(id)" < "$f")"
  while read -r kw; do
    fname="${f##*/}"
    fname="${fname%.html}"
    echo -e "$fname;$kw"
  done <<< "$(hxselect -c "body > h + desc::attr(kw)" < "$f" | tr "," $'\n' | sed 's/^ *\| *$//')"
done

echo
echo "--- filenames ---"
for f in plugins/Agregator/clanky/*.html; do
  fname="${f##*/}"
  echo "${fname%.html}"
done

echo
echo "--- mtimes ---"
for f in $(grep -l "mtime=" plugins/Agregator/clanky/*.html); do
  hxselect -c "body > h::attr(id)" < "$f"
  echo -n ";"
  hxselect -c "body > h::attr(mtime)" < "$f"
  echo
done


