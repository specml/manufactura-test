const appRes = (res, result, dbe) => {
    res.send(result);
    if (!('warning' in result)) dbe.importDump(dbe);
    dbe.logger.debug('Response:');
    dbe.logger.debug(result);
};
const appErr = (res, error, dbe)  => {
    res.send({ 'error' : error.toString() });
    dbe.logger.error(error.toString());
};

module.exports = function(app, dbEngine) {
    // create
    app.post('/:model', (req, res) => {
        app.logger.debug('Recived request CREATE ' + req.params.model);
        const data = { };
        for (let key in req.body) data[key] = req.body[key];
        try {
            dbEngine.create(req.params.model, data).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
    // read
    app.get('/:model/:id', (req, res) => {
        app.logger.debug('Recived request READ ' + req.params.model + ' with id = ' + req.params.id);
        try {
            dbEngine.readById(req.params.model, req.params.id).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
    app.get('/:model/:field/:value', (req, res) => {
        app.logger.debug('Recived request READ ' + req.params.model + ' with ' + req.params.field + ' = ' + req.params.value);
        let query = { };
        query[req.params.field] = req.params.value;
        try {
            dbEngine.read(req.params.model, query).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
    // update
    app.put('/:model/:id', (req, res) => {
        app.logger.debug('Recived request UPDATE ' + req.params.model +  'with id = ' + req.params.id);
        let data = { };
        for (let key in req.body) data[key] = req.body[key];
        try {
            dbEngine.updateById(req.params.model, req.params.id, data).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
    app.put('/:model/:field/:value', (req, res) => {
        app.logger.debug('Recived request UPDATE ' + req.params.model + ' with ' + req.params.field + ' = ' + req.params.value);
        let data = { };
        let query = { };
        query[req.params.field] = req.params.value;
        for (let key in req.body) data[key] = req.body[key];
        try {
            dbEngine.update(req.params.model, query, data).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
    // delete
    app.delete('/:model/:id', (req, res) => {
        app.logger.debug('Recived request DELETE ' + req.params.model + ' with id = ' + req.params.id);
        try {
            dbEngine.deleteById(req.params.model, req.params.id).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
    app.delete('/:model/:field/:value', (req, res) => {
        app.logger.debug('Recived request DELETE ' + req.params.model + ' with ' + req.params.field + ' = ' + req.params.value);
        let query = { };
        query[req.params.field] = req.params.value;
        try {
            dbEngine.delete(req.params.model, query).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
    // list
    app.get('/:model', (req, res) => {
        try {
            dbEngine.list(req.params.model).then(result => appRes(res, result, dbEngine), error  => appErr(res, error, dbEngine));
        } catch (e) { appErr(res, e, dbEngine); }
    });
};
