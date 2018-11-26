#!/bin/bash

getValue() {
  val="${1#\"}"
  echo "${val%\"}"
}

MIN_COUNT=5
AGREGATOR_XML="plugins/Agregator/Agregator.xml"
INPUTVAR_XML="plugins/InputVar/InputVar.xml"
URLHANDLER_XML="plugins/UrlHandler/UrlHandler.xml"
#sed -i '/for="/d' $AGREGATOR_XML
#sed -i '/<data/d' $INPUTVAR_XML
#sed -i '/<option /d' $INPUTVAR_XML
#sed -i '/gen="gen"/d' $URLHANDLER_XML

export="$(curl 'https://docs.google.com/spreadsheets/d/1ocvQnPC1IL4oS9Ip7FFial6n1JCskafrRks7VXJntgY/gviz/tq?tqx=out:csv&sheet=data')"
cache=".import.cache"
while IFS=, read -r priority sourceUrl newLink id longHeading shortHeading imgUrl ctime kw migrated gdocUrl
do
  sourceUrl="$(getValue "$sourceUrl")"
  newLink="$(getValue "$newLink")"
  id="$(getValue "$id")"
  longHeading="$(getValue "$longHeading")"
  shortHeading="$(getValue "$shortHeading")"
  imgUrl="$(getValue "$imgUrl")"
  ctime="$(getValue "$ctime")"
  kw="$(getValue "$kw")"
  normalizedKw="$(echo "$kw" | iconv -f utf8 -t ascii//TRANSLIT | tr " " "_")"
  migrated="$(getValue "$migrated")"
  gdocUrl="$(getValue "$gdocUrl")"
  [[ -n "$migrated" || -z "$gdocUrl" ]] && continue

  htmlPlus="$(curl "https://www.hostovka.cz/?Convertor=$gdocUrl")"

  grep "^$id\$" "$cache" \
    && echo "$id [skipped]" \
    && continue

  { echo "$htmlPlus" | grep "<span>Error"; } \
    && echo "$gdocUrl" \
    && exit 1

  content="$(echo "$htmlPlus" | hxselect -c "pre > code" 2>/dev/null | perl -MHTML::Entities -pe 'decode_entities($_);')"

  content="$(echo "$content" | sed "s~\(ns=\"[^\"]\+\"\)~\1 class=\"docinfo linklist\"\n  data-source=\"$sourceUrl\"\n  data-og-image=\"/files/preview/clanky/$id/general.jpg\"\n  data-og-type=\"article\"~")"
  content="$(echo "$content" | sed "s~\<h [^\>]\+ctime[^\>]\+\>~h id=\"$id\" ctime=\"$ctime\"\n    author=\"Michael Klíma\"\n    short=\"$shortHeading\"\n    authorid=\"hostovka/michael_klima~")"
  content="$(echo "$content" | sed "s~^  <desc>~  <desc kw=\"$kw\">~")"
  content="$(echo "$content" | sed 's~\s*<p>\#IMG \[.\+href="\(.\+\)".\+\] \[\(.\+\)\]</p>~<dl class="figure">\n  <dt><img src="\1" alt="\2"/></dt>\n  <dd>\2</dd>\n</dl>~g')"

  file="plugins/Agregator/clanky/$id.html"

  imgFolder="files/clanky/$id/"
  mkdir -p "$imgFolder"
  wget -O "$imgFolder/general.jpg" "$imgUrl"
  
  if ! grep "$normalizedKw" $AGREGATOR_XML; then
    sed -i "s/<\/Agregator>/  <doclist id=\"$normalizedKw\" kw=\"$kw\" for=\"clanky\" \/>\n<\/Agregator>/" $AGREGATOR_XML
  fi
  if ! grep "$normalizedKw" $INPUTVAR_XML; then 
    sed -i "s/<fn id=\"replacenames\" fn=\"replace\">/<fn id=\"replacenames\" fn=\"replace\">\n    <data name=\"=$kw\">=$normalizedKw<\/data>/" $INPUTVAR_XML
  fi



  echo "$content" > "$file"
  exit

  echo "$id" >> "$cache"

done <<< "$(echo "$export" | tail -n+2)"

