const fs = require('fs');

class dumpEngine {
    constructor() {
        this.dumpFile = './tmp/dump.json';
    }
    init(logger) {
        this.logger = logger;
        this.logger.debug('Run DumpEngine initialized');
    }
    dump(args) {
        let dumpJSON;
        if (fs.existsSync(this.dumpFile)) {
            dumpJSON = JSON.parse(fs.readFileSync(this.dumpFile, 'utf8'));
        } else {
            dumpJSON = { operation_cnt: 0 };
        }
        dumpJSON[(dumpJSON.operation_cnt++).toString()] = args;
        fs.writeFileSync(this.dumpFile, JSON.stringify(dumpJSON), 'utf8');
    }
    create(model, data) {
        this.logger.debug('Run dump.create');
        this.dump({
            operation : 'create',
            model : model,
            data : data
        });
    }
    update(model, query, data) {
        this.logger.debug('Run dump.update');
        this.dump({
            operation : 'update',
            model : model,
            query : query,
            data : data
        });
    }
    delete(model, query) {
        this.logger.debug('Run dump.delete');
        this.dump({
            operation : 'delete',
            model : model,
            query : query
        });
    }
    saveToDB(dbEngine) {
        if (fs.existsSync(this.dumpFile)) {
            this.logger.debug('Run dump.saveToDB');
            let dumpJSON = JSON.parse(fs.readFileSync(this.dumpFile, 'utf8'));
            for (let i = 0; i < dumpJSON.operation_cnt; i++)
                switch (dumpJSON[i].operation) {
                    case 'create':
                        dbEngine.create(dumpJSON[i].model, dumpJSON[i].data); break;
                    case 'update':
                        dbEngine.update(dumpJSON[i].model, dumpJSON[i].query, dumpJSON[i].data); break;
                    case 'delete':
                        dbEngine.delete(dumpJSON[i].model, dumpJSON[i].query); break;
                }
            fs.unlinkSync(this.dumpFile);
        }
    }
}
module.exports = new dumpEngine();
