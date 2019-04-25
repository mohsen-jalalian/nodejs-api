var onlinePaymentRepository = require('../app/repositories/onlinePaymentRepository.js');
var invoiceRepository = require('../app/repositories/invoiceRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');
var r = {};

r.init = (router) => {
    router.route('/onlinepayments')
        .get((req, res, next) => {
            var invoiceId = req.query.invoice_id;
            if (invoiceId) {
                invoiceRepository.getById(invoiceId, (err, data) => {
                    if (err)
                        return next(err);

                    if (!data)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                    onlinePaymentRepository.getByInvoiceId(invoiceId, (err, data) => {
                        if (err)
                            return next(err);
    
                        res.json(data);
                    });
                });
            }
            else {
                exHelper.adminPermission(req, next);
                var isFull = req.query.isFull;
                if (isFull) {
                    onlinePaymentRepository.getAll((err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                } else {
                    onlinePaymentRepository.get(req.count, req.skipPages, (err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                }
            }
        }).post((req, res, next) => {

            var invoiceId = exHelper.paramIsRequired(req, "invoiceId");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);

            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);
                
                var amount = exHelper.paramIsRequired(req, "amount");
                if (!amount)
                    return exHelper.entityMissing(req, "amount", next);
    
                var gatewayId = exHelper.paramIsRequired(req, "gatewayId");
                if (!gatewayId)
                    return exHelper.entityMissing(req, "gatewayId", next);
    
                var creationDateTime = exHelper.paramIsRequired(req, "creationDateTime");
                if (!creationDateTime)
                    return exHelper.entityMissing(req, "creationDateTime", next);
                    
                var jalaliCreationDateTime = jalalify.convertGregorianToJalali(creationDateTime);
    
                var jalaliPaymentDateTime = null;
                var paymentDateTime = exHelper.paramIsRequired(req, "paymentDateTime");
                if (paymentDateTime)
                    jalaliPaymentDateTime = jalalify.convertGregorianToJalali(jalaliPaymentDateTime);
    
                var paidAmount = exHelper.paramIsRequired(req, "paidAmount");
                var transactionId = exHelper.paramIsRequired(req, "transactionId");
                
                var stateId = exHelper.paramIsRequired(req, "stateId");
                if (!stateId)
                    return exHelper.entityMissing(req, "stateId", next);
    
                onlinePaymentRepository.insert(invoiceId, amount, gatewayId, creationDateTime, jalaliCreationDateTime, paymentDateTime, jalaliPaymentDateTime, paidAmount, transactionId, stateId, (err, data) => {
                    if (err)
                        return next(err);
    
                    res.json(data);
                });
            });
        });

    router.route('/onlinepayments/:id')
        .get((req, res, next) => {
            var id = req.params.id;

            onlinePaymentRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'online payment id ' + id, next);

                var invoiceId = data[0].InvoiceId;
                invoiceRepository.getById(invoiceId, (err, data) => {
                    if (err)
                        return next(err);

                    if (!data)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                    res.json(data);
                });
            })
        })
        .put((req, res, next) => {

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var invoiceId = exHelper.paramIsRequired(req, "invoiceId");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);

            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                var amount = exHelper.paramIsRequired(req, "amount");
                if (!amount)
                    return exHelper.entityMissing(req, "amount", next);

                var gatewayId = exHelper.paramIsRequired(req, "gatewayId");
                if (!gatewayId)
                    return exHelper.entityMissing(req, "gatewayId", next);

                var creationDateTime = exHelper.paramIsRequired(req, "creationDateTime");
                if (!creationDateTime)
                    return exHelper.entityMissing(req, "creationDateTime", next);

                var jalaliCreationDateTime = jalalify.convertGregorianToJalali(creationDateTime);

                var jalaliPaymentDateTime = null;
                var paymentDateTime = exHelper.paramIsRequired(req, "paymentDateTime");
                if (paymentDateTime)
                    jalaliPaymentDateTime = jalalify.convertGregorianToJalali(jalaliPaymentDateTime);

                var paidAmount = exHelper.paramIsRequired(req, "paidAmount");
                var transactionId = exHelper.paramIsRequired(req, "transactionId");

                var stateId = exHelper.paramIsRequired(req, "stateId");
                if (!stateId)
                    return exHelper.entityMissing(req, "stateId", next);

                onlinePaymentRepository.update(id, invoiceId, amount, gatewayId, creationDateTime, jalaliCreationDateTime, paymentDateTime, jalaliPaymentDateTime, paidAmount, transactionId, stateId, (err, data) => {
                    if (err) {
                        return next(err);
                    }

                    var edited = {
                        Id: id,
                        InvoiceId: invoiceId,
                        Amount: amount,
                        GatewayId: gatewayId,
                        CreationDateTime: creationDateTime,
                        JalaliCreationDateTime: jalaliCreationDateTime,
                        PaymentDateTime: jalaliPaymentDateTime,
                        PaidAmount: paidAmount,
                        TransactionId: transactionId,
                        StateId: stateId
                    };
                    res.json(edited);
                });
            });
        })
        .delete((req, res, next) => {
            var id = req.params.id;
            onlinePaymentRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'online payment id ' + id, next);

                var invoiceId = data[0].InvoiceId;
                invoiceRepository.getById(invoiceId, (err, invoiceData) => {
                    if (err)
                        return next(err);

                    if (!invoiceData)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, invoiceData[0].AccountId, next);

                    onlinePaymentRepository.delete(req.params.id, (err, data) => {
                        if (err)
                            return next(err);

                        res.json({
                            Id: req.params.id
                        });
                    });
                });
            })
        });

    router.route('/onlinepayments/:id/changestate')
        .put((req, res, next) => {

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            onlinePaymentRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'online payment id ' + id, next);

                var invoiceId = data[0].InvoiceId;
                invoiceRepository.getById(invoiceId, (err, invoiceData) => {
                    if (err)
                        return next(err);

                    if (!invoiceData)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, invoiceData[0].AccountId, next);

                    var stateId = exHelper.paramIsRequired(req, "stateId");
                    if (!stateId)
                        return exHelper.entityMissing(req, "stateId", next);

                    onlinePaymentRepository.changeState(id, stateId, (err, data) => {
                        if (err)
                            return next(err);

                        res.json('ok');
                    });
                });
            })
        });
}


module.exports = r;