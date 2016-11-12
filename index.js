'use strict';

const LineByLineReader = require('line-by-line'),
  lr = new LineByLineReader('dump_utf.csv'),
  Papa = require('papaparse'),
  fs = require('fs'),
  knexfile = require("./knexfile.js");

const knexconf = knexfile[process.env.ENVIRONMENT || 'development'];
const knex = require('knex')(knexconf);

const papacfg = {	delimiter: ";", header: true };
const header = "IP;Domain;URL;Authority;Index;Date\n";


let a = 0,
  b = 0;

const inserts = [];

lr.on('line', (line) => {
  a++;

  if (line.indexOf("ФСКН") > 0) {
    const parsedLine = Papa.parse(header + line, papacfg);
    // parsedLine.data[0].IP = parsedLine.data[0].IP.split(" | ");
    // console.log(parsedLine.data)
    inserts.push(knex('rkn').insert(parsedLine.data));
  };
});

lr.on('end', () => {
  Promise.all(inserts).then((result) => {
    process.exit(0);
  })

  console.log(`${a} lines parsed, ${inserts.length} lines matched`);
})
