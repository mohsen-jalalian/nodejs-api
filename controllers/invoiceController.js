var invoiceRepository = require('../app/repositories/invoiceRepository.js');
var productSaleRepository = require('../app/repositories/productSaleRepository.js');
var invoiceItemRepository = require('../app/repositories/invoiceItemRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');
var _ = require('underscore');
var r = {};

r.init = (router) => {
    router.route('/invoices')
        .get((req, res, next) => {
            var accountId = req.query.account_id;
            if (accountId) {
                exHelper.adminAndSelfPermission(req, accountId, next);
                invoiceRepository.getByAccountId(accountId, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
            else {
                exHelper.adminPermission(req, next);
                var isFull = req.query.isFull;
                if (isFull) {
                    invoiceRepository.getAll((err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                } 
                else {
                    invoiceRepository.get(req.count, req.skipPages, (err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                }
            }
        }).post((req, res, next) => {

            var accountId = exHelper.paramIsRequired(req, "accountId");
            if (!accountId)
                return exHelper.entityMissing(req, "accountId", next);

            exHelper.adminAndSelfPermission(req, accountId, next);

            var typeId = exHelper.paramIsRequired(req, "typeId");
            if (!typeId)
                return exHelper.entityMissing(req, "typeId", next);

            var activationStateId = exHelper.paramIsRequired(req, "activationStateId");
            if (!activationStateId)
                return exHelper.entityMissing(req, "activationStateId", next);

            var dateTime = new Date();
            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            invoiceRepository.insert(accountId, dateTime, jalaliDateTime, typeId, activationStateId, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/invoices/:id')
        .get((req, res, next) => {
            var invoiceId = req.params.id;
            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);                

                res.json(data);
            })
        })
        .put((req, res, next) => {

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var accountId = exHelper.paramIsRequired(req, "accountId");
            if (!accountId)
                return exHelper.entityMissing(req, "accountId", next);

            exHelper.adminAndSelfPermission(req, accountId, next);

            var dateTime = exHelper.paramIsRequired(req, "dateTime");
            if (!dateTime)
                return exHelper.entityMissing(req, "dateTime", next);

            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            var typeId = exHelper.paramIsRequired(req, "typeId");
            if (!typeId)
                return exHelper.entityMissing(req, "typeId", next);

            var activationStateId = exHelper.paramIsRequired(req, "activationStateId");
            if (!activationStateId)
                return exHelper.entityMissing(req, "activationStateId", next);

            invoiceRepository.update(id, accountId, dateTime, jalaliDateTime, typeId, activationStateId, (err, data) => {
                if (err) {
                    return next(err);
                }

                var edited = {
                    Id: id,
                    AccountId: accountId, 
                    DateTime: dateTime, 
                    JalaliDateTime: jalaliDateTime, 
                    TypeId: typeId, 
                    ActivationStateId: activationStateId
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            var invoiceId = exHelper.paramIsRequired(req, "id");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);
                
            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                invoiceRepository.delete(req.params.id, (err, data) => {
                    if (err)
                        return next(err);

                    res.json({
                        Id: req.params.id
                    });
                });
            });
        });

    router.route('/invoices/:id/changetype')
        .put((req, res, next) => {

            var invoiceId = exHelper.paramIsRequired(req, "id");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);
            
            var typeId = exHelper.paramIsRequired(req, "typeId");
            if (!typeId)
                return exHelper.entityMissing(req, "typeId", next);
             
            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                invoiceRepository.changeType(invoiceId, typeId, (err, data) => {
                    if (err)
                        return next(err);

                    //changed to invoice
                    if (typeId == "2") {
                        invoiceItemRepository.getByInvoiceId(invoiceId, (err, data) => {
                            _.each(data, (it) => {
                                productSaleRepository.sale(it.ProductId, new Date(), (err, result) => {})
                            })
                        })
                    }
                    res.json('ok');
                });
            });
        });
}

module.exports = r;