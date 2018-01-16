const initDB = require('./initDB');
const routes = require('./routes');

module.exports = function(app, dbEngine) {
  initDB(app, dbEngine);
  routes(app, dbEngine);
};
