var transactionRepository = require('../app/repositories/transactionRepository.js');
var invoiceRepository = require('../app/repositories/invoiceRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');
var r = {};

r.init = (router) => {
    router.route('/transactions')
        .get((req, res, next) => {
            var invoiceId = req.query.invoice_id;
            var accountId = req.query.account_id;
            var pageCount = req.count;
            var pageSkips = req.pageSkips;
            if (invoiceId) {
                invoiceRepository.getById(invoiceId, (err, data) => {
                    if (err)
                        return next(err);

                    if (!data)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                   transactionRepository.getByInvoiceId(invoiceId, pageCount, pageSkips, (err, data) => {
                       if (err)
                           return next(err);

                       res.json(data);
                   });
                });
            }
            else if (accountId) {
                exHelper.adminAndSelfPermission(req, accountId, next);
                transactionRepository.getByAccountId(accountId, pageCount, pageSkips, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
            else {
                exHelper.adminPermission(req, next);
                var isFull = req.query.isFull;
                if (isFull) {
                    transactionRepository.getAll((err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                } else {
                    transactionRepository.get(req.count, req.skipPages, (err, data) => {
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

            var invoiceId = exHelper.paramIsRequired(req, "invoiceId");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);

            var amount = exHelper.paramIsRequired(req, "amount");
            if (!amount)
                return exHelper.entityMissing(req, "amount", next);

            var dateTime = exHelper.paramIsRequired(req, "dateTime");
            if (!dateTime)
                return exHelper.entityMissing(req, "dateTime", next);
                
            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            var typeId = exHelper.paramIsRequired(req, "typeId");
            if (!typeId)
                return exHelper.entityMissing(req, "typeId", next);

            var description = exHelper.paramIsRequired(req, "description");

            transactionRepository.insert(accountId, invoiceId, amount, dateTime, jalaliDateTime, typeId, description, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/transactions/:id')
        .get((req, res, next) => {
            var transactionId = req.params.id;
            transactionRepository.getById(transactionId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction id ' + transactionId, next);

                var accountId = data[0].AccountId;
                exHelper.adminAndSelfPermission(req, accountId, next);

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

            var invoiceId = exHelper.paramIsRequired(req, "invoiceId");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);

            var amount = exHelper.paramIsRequired(req, "amount");
            if (!amount)
                return exHelper.entityMissing(req, "amount", next);

            var dateTime = exHelper.paramIsRequired(req, "dateTime");
            if (!dateTime)
                return exHelper.entityMissing(req, "dateTime", next);

            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            var typeId = exHelper.paramIsRequired(req, "typeId");
            if (!typeId)
                return exHelper.entityMissing(req, "typeId", next);

            var description = exHelper.paramIsRequired(req, "description");

            transactionRepository.update(id, accountId, invoiceId, amount, dateTime, jalaliDateTime, typeId, description, (err, data) => {
                if (err) {
                    return next(err);
                }

                var edited = {
                    Id: id,
                    AccountId: accountId, 
                    InvoiceId: invoiceId, 
                    Amount: amount,
                    DateTime: dateTime, 
                    JalaliDateTime: jalaliDateTime, 
                    TypeId: typeId, 
                    Description: description
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            var transactionId = req.params.id;
            transactionRepository.getById(transactionId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction id ' + transactionId, next);

                var accountId = data[0].AccountId;
                exHelper.adminAndSelfPermission(req, accountId, next);

                transactionRepository.delete(req.params.id, (err, data) => {
                    if (err)
                        return next(err);
    
                    res.json({
                        Id: req.params.id
                    });
                });
            })
        });

    router.route('/transactions/:id/changetype')
        .put((req, res, next) => {

            var transactionId = exHelper.paramIsRequired(req, "id");
            if (!transactionId)
                return exHelper.entityMissing(req, "transactionId", next);

            transactionRepository.getById(transactionId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'transaction id ' + transactionId, next);

                var accountId = data[0].AccountId;
                exHelper.adminAndSelfPermission(req, accountId, next);

                var typeId = exHelper.paramIsRequired(req, "typeId");
                if (!typeId)
                    return exHelper.entityMissing(req, "typeId", next);
                    
                transactionRepository.changeType(transactionId, typeId, (err, data) => {
                    if (err)
                        return next(err);
    
                    res.json('ok');
                });
            })
        });
}

module.exports = r;