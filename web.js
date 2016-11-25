const knexfile = require("./knexfile.js"),
  knexconf = knexfile[process.env.ENVIRONMENT || 'development'],
  knex = require('knex')(knexconf),
  Promise = require('bluebird'),
  _ = require('lodash'),
  app = require('express')();

const getCount = (select, key) => {
  return select.map(res => {
    return [res[key], res['count(*)']]
  }).then((arr) => {
    return _.fromPairs(arr);
  });
};

const totalCount = () => {
  return knex('rkn').count().then((res) => {
    return res[0]['count(*)']
  });
};

const top5Domains = () => {
  return getCount(knex.raw(`
    select Domain, count(*) from rkn where domain != ''
    group by 1
    order by 2 desc
    limit 10
  `), 'Domain');
}
top5Domains();

const countAuthorities = () => {
  return getCount(knex('rkn').select('Authority')
    .count('*')
    .groupBy('Authority'), 'Authority');
}

app.get('/', (req, res) => {
  Promise.all([countAuthorities(), totalCount(), top5Domains()])
    .spread((countAuthorities, totalCount, top5Domains) => {
      res.send({
        total: totalCount,
        stats: {
          autority: countAuthorities,
          domain: top5Domains
        }
      });
    });
})

app.listen(3000, () => {
  console.log('App running on port 3000');
})

// query.map((entry) => {
//     entry.IP = entry.IP.split(" | ");
//     return entry;
// }).then(console.log).then(process.exit);
