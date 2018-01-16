const app = require('express')();
const bodyParser = require('body-parser');
const dbEngine = require('./dbEngine');
const log4js = require('log4js');
const path = require('path');
const logConfig = require(path.join(process.cwd(),'config/log.json'));

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: './logs.log' }
    },
    categories: {
        default: { appenders: [ 'everything' ], level: 'debug' }
    }
});
app.logger = log4js.getLogger();
app.logger.level = logConfig.level;
dbEngine.init(app.logger);
require('./routes')(app, dbEngine);
app.listen(port, () => {
    app.logger.debug('Listening port ' + port);
});
