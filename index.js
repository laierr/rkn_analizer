'use strict';

const LineByLineReader = require('line-by-line'),
  Promise = require('bluebird'),
  lr = new LineByLineReader('dump_utf.csv'),
  Papa = require('papaparse'),
  _ = require('lodash'),
  fs = require('fs'),
  knexfile = require("./knexfile.js");

const knexconf = knexfile[process.env.ENVIRONMENT || 'development'];
const knex = require('knex')(knexconf);

const papacfg = {
  delimiter: ";",
  header: true
};
const header = "IP;Domain;URL;Authority;Index;Date\n";


let count = 0;
const lines = [];

lr.on('line', (line) => {
  count++;

  const parsedLine = Papa.parse(header + line, papacfg);
  // parsedLine.data[0].IP = parsedLine.data[0].IP.split(" | ");
  // console.log(parsedLine.data[0])
  lines.push(parsedLine.data[0]);
});

lr.on('end', () => {
  const chunks = _.chunk(lines, 100),
    inserts = _.map(chunks, (chunk, index) => {
      return knex('rkn').insert(chunk);
    });

  Promise.all(inserts).then((result) => {
    process.exit(0);
  });

  console.log(`${count} lines parsed, ${lines.length} lines processed`);
})
