const Sequelize = require('sequelize');

module.exports = function(app, db) {
    app.patch('/initDB', (req, res) => {
    app.sequelize.define('customers', {
        code: Sequelize.STRING,
        name: Sequelize.STRING,
        phone: Sequelize.STRING,
        address: Sequelize.STRING,
        company: Sequelize.STRING,
        closed: Sequelize.BOOLEAN
    }).sync({ force: true });

    app.sequelize.define('orders', {
        code: Sequelize.STRING,
        custName: Sequelize.STRING,
        transDate: Sequelize.DATEONLY,
        deliveryDate: Sequelize.DATEONLY,
        deliveryAddress: Sequelize.STRING,
        sum: Sequelize.DOUBLE,
        cyrrency: Sequelize.STRING,
        approved: Sequelize.BOOLEAN,
        closed: Sequelize.BOOLEAN
    }).sync({ force: true });

    app.sequelize.define('currencies', {
        code: Sequelize.STRING,
        name: Sequelize.STRING
    }).sync({ force: true });

    app.logger.debug('Database initialized');
    res.send('Database initialized');
  });
};
