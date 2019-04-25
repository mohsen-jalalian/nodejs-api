var transactionParameterRepository = require('../app/repositories/transactionParameterRepository.js');
var transactionRepository = require('../app/repositories/transactionRepository.js');
var exHelper = require('../exceptionHelper.js');
var r = {};

r.init = (router) => {
    router.route('/transactionparameters')
        .get((req, res, next) => {
            exHelper.adminPermission(req, next);
            transactionParameterRepository.getAll((err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        }).post((req, res, next) => {

            var transactionId = exHelper.paramIsRequired(req, "transactionId");
            if (!transactionId)
                return exHelper.entityMissing(req, "transactionId", next);

            transactionRepository.getById(transactionId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction id ' + transactionId, next);

                var accountId = data[0].AccountId;
                exHelper.adminAndSelfPermission(req, accountId, next);

                var key = exHelper.paramIsRequired(req, "key");
                if (!key)
                    return exHelper.entityMissing(req, "key", next);
    
                var value = exHelper.paramIsRequired(req, "value");
                if (!value)
                    return exHelper.entityMissing(req, "value", next);
    
                transactionParameterRepository.insert(transactionId, key, value, (err, data) => {
                    if (err)
                        return next(err);
    
                    res.json(data);
                });
            })
        });

    router.route('/transactionparameters/:id')
        .get((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = req.params.id;
            transactionParameterRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction parameter id ' + id, next);

                res.json(data);
            })
        })
        .put((req, res, next) => {

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var transactionId = exHelper.paramIsRequired(req, "transactionId");
            if (!transactionId)
                return exHelper.entityMissing(req, "transactionId", next);

            transactionRepository.getById(transactionId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction id ' + transactionId, next);

                var accountId = data[0].AccountId;
                exHelper.adminAndSelfPermission(req, accountId, next);

                var key = exHelper.paramIsRequired(req, "key");
                if (!key)
                    return exHelper.entityMissing(req, "key", next);

                var value = exHelper.paramIsRequired(req, "value");
                if (!value)
                    return exHelper.entityMissing(req, "value", next);

                transactionParameterRepository.update(id, transactionId, key, value, (err, data) => {
                    if (err) {
                        return next(err);
                    }

                    var edited = {
                        Id: id,
                        TransactionId: transactionId,
                        Key: key,
                        Value: value
                    };
                    res.json(edited);
                });
            })
        })
        .delete((req, res, next) => {

            var id = req.params.id;
            transactionParameterRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction parameter id ' + id, next);

                var transactionId = data[0].TransactionId;
                transactionRepository.getById(transactionId, (err, data) => {
                    if (err)
                        return next(err);

                    if (!data)
                        return exHelper.notFound(req, 'transaction id ' + transactionId, next);

                    var accountId = data[0].AccountId;
                    exHelper.adminAndSelfPermission(req, accountId, next);

                    transactionParameterRepository.delete(req.params.id, (err, data) => {
                        if (err)
                            return next(err);

                        res.json({
                            Id: req.params.id
                        });
                    });
                })
            })
        });

    router.route('/transactions/:id/parameters')
        .get((req, res, next) => {
            var transactionId = req.params.id;
            transactionRepository.getById(transactionId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction id ' + transactionId, next);

                var accountId = data[0].AccountId;
                exHelper.adminAndSelfPermission(req, accountId, next);
                
                transactionParameterRepository.getByTransactionId(transactionId, (err, data) => {
                    if (err)
                        return next(err);
    
                    res.json(data);
                });
            })
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            var transactionId = req.params.id;
            transactionParameterRepository.deleteByTransactionId(transactionId, (err, data) => {
                if (err)
                    return next(err);

                res.json("deleted all");
            });
        });
}

module.exports = r;