var onlinePaymentParameterRepository = require('../app/repositories/onlinePaymentParameterRepository.js');
var onlinePaymentRepository = require('../app/repositories/onlinePaymentRepository.js');
var invoiceRepository = require('../app/repositories/invoiceRepository.js');
var exHelper = require('../exceptionHelper.js');
var r = {};

r.init = (router) => {
    router.route('/onlinepayments/:id/parameters')
        .get((req, res, next) => {

            exHelper.adminPermission(req, next);
            
            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            onlinePaymentParameterRepository.getByOnlinePaymentId(id, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        }).post((req, res, next) => {

            var onlinePaymentId = exHelper.paramIsRequired(req, "id");
            if (!onlinePaymentId)
                return exHelper.entityMissing(req, "onlinePaymentId", next);

            onlinePaymentRepository.getById(onlinePaymentId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'online payment id ' + onlinePaymentId, next);

                var invoiceId = data[0].InvoiceId;
                invoiceRepository.getById(invoiceId, (err, data) => {
                    if (err)
                        return next(err);

                    if (!data)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                    var key = exHelper.paramIsRequired(req, "key");
                    if (!key)
                        return exHelper.entityMissing(req, "key", next);

                    var value = exHelper.paramIsRequired(req, "value");
                    if (!value)
                        return exHelper.entityMissing(req, "value", next);

                    onlinePaymentParameterRepository.insert(onlinePaymentId, key, value, (err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                });
            })
        }).delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            var onlinePaymentId = req.params.id;
            onlinePaymentParameterRepository.deleteByOnlinePaymentId(onlinePaymentId, (err, data) => {
                if (err)
                    return next(err);

                res.json("deleted all");
            });
        });

    router.route('/onlinepaymentparameters/:id')
        .get((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = req.params.id;
            onlinePaymentParameterRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'online payment paramter id ' + id, next);

                res.json(data);
            })
        })
        .put((req, res, next) => {

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var onlinePaymentId = exHelper.paramIsRequired(req, "onlinePaymentId");
            if (!onlinePaymentId)
                return exHelper.entityMissing(req, "onlinePaymentId", next);

            onlinePaymentRepository.getById(onlinePaymentId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'online payment id ' + onlinePaymentId, next);

                var invoiceId = data[0].InvoiceId;
                invoiceRepository.getById(invoiceId, (err, data) => {
                    if (err)
                        return next(err);

                    if (!data)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                    var key = exHelper.paramIsRequired(req, "key");
                    if (!key)
                        return exHelper.entityMissing(req, "key", next);

                    var value = exHelper.paramIsRequired(req, "value");
                    if (!value)
                        return exHelper.entityMissing(req, "value", next);

                    onlinePaymentParameterRepository.update(id, onlinePaymentId, key, value, (err, data) => {
                        if (err) {
                            return next(err);
                        }

                        var edited = {
                            Id: id,
                            OnlinePaymentId: onlinePaymentId,
                            Key: key,
                            Value: value
                        };
                        res.json(edited);
                    });
                });
            })
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);
            onlinePaymentParameterRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({
                    Id: req.params.id
                });
            });
        });
}


module.exports = r;