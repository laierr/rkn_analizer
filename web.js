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

const top10Domains = () => {
  return getCount(knex.raw(`
    select Domain, count(*) from rkn where domain != ''
    group by 1
    order by 2 desc
    limit 10
  `), 'Domain');
}

const countAuthorities = () => {
  return getCount(knex('rkn').select('Authority')
    .count('*')
    .groupBy('Authority'), 'Authority');
}

app.get('/', (req, res) => {
  Promise.all([countAuthorities(), totalCount(), top10Domains()])
    .spread((countAuthorities, totalCount, top10Domains) => {
      res.send({
        total: totalCount,
        stats: {
          autority: countAuthorities,
          domain: top10Domains
        }
      });
    });
})

app.listen(3000, () => {
  console.log('App running on port 3000');
})
