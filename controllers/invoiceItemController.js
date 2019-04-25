var invoiceItemRepository = require('../app/repositories/invoiceItemRepository.js');
var invoiceRepository = require('../app/repositories/invoiceRepository.js');
var exHelper = require('../exceptionHelper.js');
var r = {};

r.init = (router) => {
    router.route('/invoiceitems/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            invoiceItemRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice item id ' + id, next);

                var invoiceId = data[0].InvoiceId;
                invoiceRepository.getById(invoiceId, (err, invoiceData) => {
                    if (err)
                        return next(err);

                    if (!invoiceData)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, invoiceData[0].AccountId, next);

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

                var title = exHelper.paramIsRequired(req, "title");
                if (!title)
                    return exHelper.entityMissing(req, "title", next);

                var productId = exHelper.paramIsRequired(req, "productId");
                if (!productId)
                    return exHelper.entityMissing(req, "productId", next);

                var count = exHelper.paramIsRequired(req, "count");
                if (!count)
                    return exHelper.entityMissing(req, "count", next);

                var amount = exHelper.paramIsRequired(req, "amount");
                if (!amount)
                    return exHelper.entityMissing(req, "amount", next);

                var totalAmount = exHelper.paramIsRequired(req, "totalAmount");
                if (!totalAmount)
                    return exHelper.entityMissing(req, "totalAmount", next);

                invoiceItemRepository.update(id, invoiceId, title, productId, count, amount, totalAmount, (err, data) => {
                    if (err) {
                        return next(err);
                    }

                    var edited = {
                        Id: id,
                        InvoiceId: invoiceId,
                        Title: title,
                        ProductId: productId,
                        Count: count,
                        Amount: amount,
                        TotalAmount: totalAmount,
                    };
                    res.json(edited);
                });
            });
        })
        .delete((req, res, next) => {
            var id = req.params.id;
            invoiceItemRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice item id ' + id, next);

                var invoiceId = data[0].InvoiceId;
                invoiceRepository.getById(invoiceId, (err, invoiceData) => {
                    if (err)
                        return next(err);

                    if (!invoiceData)
                        return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                    exHelper.adminAndSelfPermission(req, invoiceData[0].AccountId, next);

                    invoiceItemRepository.delete(req.params.id, (err, data) => {
                        if (err)
                            return next(err);

                        res.json({
                            Id: req.params.id
                        });
                    });
                });
            })
        });

    router.route('/invoice/:id/items')
        .get((req, res, next) => {
            
            var invoiceId = exHelper.paramIsRequired(req, "invoiceId");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);
                
            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                invoiceItemRepository.getByInvoiceId(invoiceId, (err, data) => {
                    if (err)
                        return next(err);
    
                    res.json(data);
                });
            });
        })
        .post((req, res, next) => {

            var invoiceId = exHelper.paramIsRequired(req, "invoiceId");
            if (!invoiceId)
                return exHelper.entityMissing(req, "invoiceId", next);

            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                var title = exHelper.paramIsRequired(req, "title");
                if (!title)
                    return exHelper.entityMissing(req, "title", next);

                var productId = exHelper.paramIsRequired(req, "productId");
                if (!productId)
                    return exHelper.entityMissing(req, "productId", next);

                var count = exHelper.paramIsRequired(req, "count");
                if (!count)
                    return exHelper.entityMissing(req, "count", next);

                var amount = exHelper.paramIsRequired(req, "amount");
                if (!amount)
                    return exHelper.entityMissing(req, "amount", next);

                var totalAmount = exHelper.paramIsRequired(req, "totalAmount");
                if (!totalAmount)
                    return exHelper.entityMissing(req, "totalAmount", next);

                invoiceItemRepository.insert(invoiceId, title, productId, count, amount, totalAmount, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            });
        })
        .delete((req, res, next) => {
            var invoiceId = req.params.id;
            invoiceRepository.getById(invoiceId, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'invoice id ' + invoiceId, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                invoiceItemRepository.deleteByInvoiceId(invoiceId, (err, data) => {
                    if (err)
                        return next(err);

                    res.json("deleted all");
                });
            });
        });
}


module.exports = r;