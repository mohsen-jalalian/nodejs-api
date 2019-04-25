var productPriceHistoryRepository = require('../app/repositories/productPriceHistoryRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');

var r = {};

r.init = (router) => {
    router.route('/productpricehistories')
        .get((req, res, next) => {
            var productId = req.query.product_id;
            if (productId) {
                productPriceHistoryRepository.getByProductId(productId, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
            else {
                var isFull = req.query.isFull;
                if (isFull) {
                    productPriceHistoryRepository.getAll((err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                } else {
                    productPriceHistoryRepository.get(req.count, req.skipPages, (err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                }
            }
        }).post((req, res, next) => {
            exHelper.adminPermission(req, next);

            var productId = exHelper.paramIsRequired(req, "productId");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            var price = exHelper.paramIsRequired(req, "price");
            if (!price)
                return exHelper.entityMissing(req, "price", next);

            var dateTime = exHelper.paramIsRequired(req, "dateTime");
            if (!dateTime)
                return exHelper.entityMissing(req, "dateTime", next);

            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            productPriceHistoryRepository.insert(productId, price, dateTime, jalaliDateTime, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/productpricehistories/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            productPriceHistoryRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'product price history id ' + id, next);

                res.json(data);
            })
        })
        .put((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var productId = exHelper.paramIsRequired(req, "productId");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            var price = exHelper.paramIsRequired(req, "price");
            if (!price)
                return exHelper.entityMissing(req, "price", next);

            var dateTime = exHelper.paramIsRequired(req, "dateTime");
            if (!dateTime)
                return exHelper.entityMissing(req, "dateTime", next);

            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            productPriceHistoryRepository.update(id, productId, price, dateTime, jalaliDateTime, (err, data) => {
                if (err)
                    return next(err);

                var edited = {
                    Id: id,
                    ProductId: productId,
                    Price: price,
                    DateTime: dateTime,
                    JalaliDateTime: jalaliDateTime
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            productPriceHistoryRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({
                    Id: req.params.id
                });
            });
        });
}

module.exports = r;