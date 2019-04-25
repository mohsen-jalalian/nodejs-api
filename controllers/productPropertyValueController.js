var productPropertyValueRepository = require('../app/repositories/productPropertyValueRepository.js');
var exHelper = require('../exceptionHelper.js');

var r = {};

r.init = (router) => {
    router.route('/productpropertyvalues')
        .get((req, res, next) => {
            var productId = req.query.product_id;
            if (productId) {
                productPropertyValueRepository.getByProductId(productId, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
            else {
                productPropertyValueRepository.getAll((err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
        }).post((req, res, next) => {
            exHelper.adminPermission(req, next);

            var productId = exHelper.paramIsRequired(req, "productId");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            var productPropertyId = exHelper.paramIsRequired(req, "productPropertyId");
            if (!productPropertyId)
                return exHelper.entityMissing(req, "productPropertyId", next);

            var value = exHelper.paramIsRequired(req, "value");
            if (!value)
                return exHelper.entityMissing(req, "value", next);

            productPropertyValueRepository.insert(productId, productPropertyId, value, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        }).delete((req, res, next) => {
            exHelper.adminPermission(req, next);
            var productId = exHelper.paramIsRequired(req, "product_id");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            productPropertyValueRepository.deleteByProductId(productId, (err, data) => {
                if (err)
                    return next(err);

                res.json('deleted all by product id');
            });
        });

    router.route('/productpropertyvalues/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            productPropertyValueRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'product property value id ' + id, next);

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

            var productPropertyId = exHelper.paramIsRequired(req, "productPropertyId");
            if (!productPropertyId)
                return exHelper.entityMissing(req, "productPropertyId", next);

            var value = exHelper.paramIsRequired(req, "value");
            if (!value)
                return exHelper.entityMissing(req, "value", next);

            productPropertyValueRepository.update(id, productId, productPropertyId, value, (err, data) => {
                if (err)
                    return next(err);

                var edited = {
                    Id: id,
                    ProductId: productId,
                    ProductPropertyId: productPropertyId,
                    Value: value
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            productPropertyValueRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({Id: req.params.id});
            });
        });
}


module.exports = r;