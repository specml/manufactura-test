const Sequelize = require('sequelize');

module.exports = function(app, db) {
    app.get('/initDB', (req, res) => {
    db.sequelize.define('customers', {
        code: Sequelize.STRING,
        name: Sequelize.STRING,
        phone: Sequelize.STRING,
        address: Sequelize.STRING,
        company: Sequelize.STRING,
        closed: Sequelize.BOOLEAN
    }).sync({ force: true });

    db.sequelize.define('orders', {
        code: Sequelize.STRING,
        custName: Sequelize.STRING,
        transDate: Sequelize.DATEONLY,
        deliveryDate: Sequelize.DATEONLY,
        deliveryAddress: Sequelize.STRING,
        sum: Sequelize.DOUBLE,
        currency: Sequelize.STRING,
        approved: Sequelize.BOOLEAN,
        closed: Sequelize.BOOLEAN
    }).sync({ force: true });

    db.sequelize.define('currencies', {
        code: Sequelize.STRING,
        name: Sequelize.STRING
    }).sync({ force: true });

    app.logger.debug('Database initialized');
    res.send('Database initialized');
  });
};
