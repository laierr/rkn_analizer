#!/bin/bash

wget https://raw.githubusercontent.com/zapret-info/z-i/master/dump.csv -O ./dump.csv

iconv -f cp1251 -t UTF8 dump.csv > dump_utf.csv

node index.js
