const fs = require("fs");
const Sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto')
const path = require('path');
const dbConfig = require(path.join(process.cwd(),'config/db.json')).development;
const dump = require('./dumpEngine');

const errHandler = (err, func) => {
    if (err.name  == 'SequelizeConnectionRefusedError') {
        func();
        return Promise.resolve({ 'warning' : 'Connection to DB refused. Changes will be saved when the connection is restored.' });
    } else {
        return Promise.reject(err);
    }
}
const resHandler = (res) => {
    return Promise.resolve(res);
}

class dbEngine {
    constructor() { }
    init(logger) {
        this.logger = logger;
        let modelsPath  = "tmp/models";
        let sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.username,
            dbConfig.password,
            {
                host:    dbConfig.host,
                dialect: dbConfig.dialect,
                logging: !!process.env.DEBUGMODE
            }
        );
        sequelize.authenticate()
            .then(()   => { this.logger.debug('Connection with DB has been established successfully.'); })
            .catch(err => { this.logger.error('Unable to connect to the database:', err); });
        let auto = new SequelizeAuto(dbConfig.database, dbConfig.username, dbConfig.password, {
            host: dbConfig.host,
            dialect: dbConfig.dialect,
            directory: modelsPath,
            port: 5432
        });
        auto.run(function (err) { if (err) throw err; });
        this.logger.debug('Sequelize-auto generates models for Sequelize in ' + modelsPath);
        if fs.existsSync(modelsPath) {
            fs.readdirSync(modelsPath).forEach(file => { require("../" + path.join(modelsPath,file))(sequelize,Sequelize); });
        }
        this.logger.debug('Modules imported in Sequelize');
        this.sequelize = sequelize;
        dump.init(this.logger);
        this.logger.debug('DBEngine initialized');
    }
    create(model, data) {
        return this.sequelize.model(model).create(data).then(
            result => resHandler(result),
            error => errHandler(error, () => dump.create(model, data))
        );
    }
    read(model, query) {
        return this.sequelize.model(model).findAll({ where: query }).then(
            result => resHandler(result),
            error => errHandler(error, () => {})
        );
    }
    readById(model, id) {
        return this.read(model, { 'id' : id });
    }
    update(model, query, data) {
        let msg = ('id' in query) ? 'Record of \'' + model + '\' with id=' + query.id + ' updated' : null;
        return this.sequelize.model(model).update(data, { where : query }).then(
            result => resHandler({ 'result' : (msg) ? msg :  result + ' record(s) of \'' + model + '\' updated'}),
            error => errHandler(error, () => dump.update(model, query, data))
        );
    }
    updateById(model, id, data) {
        return this.update(model, { 'id' : id }, data);
    }
    delete(model, query) {
        let msg = ('id' in query) ? 'Record of \'' + model + '\' with id=' + query.id + ' deleted' : null;
        return this.sequelize.model(model).destroy({ where : query }).then(
            result => resHandler({ 'result' : (msg) ? msg :  result + ' record(s) of \'' + model + '\' deleted'}),
            error => errHandler(error, () => dump.delete(model, query))
        );
    }
    deleteById(model, id) {
        return this.delete(model, { 'id' : id });
    }
    list(model) {
        return this.sequelize.model(model).findAll().then(
            result => resHandler(result),
            error => errHandler(error, () => {})
        );;
    }
    importDump(arg) {
        dump.saveToDB(arg);
    }
}

module.exports = new dbEngine();
