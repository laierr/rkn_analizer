
exports.up = function(knex, Promise) {
  return knex.schema.createTable('rkn', (table) => {
    table.increments();
    table.string('IP');
    table.string('Domain');
    table.string('URL');
    table.string('Authority');
    table.string('Index');
    table.string('Date');
    table.timestamps();
  })
};
exports.down = function(knex, Promise) {

};
