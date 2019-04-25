var productImageRepository = require('../app/repositories/productImageRepository.js');
var exHelper = require('../exceptionHelper.js');

var r = {};

r.init = (router) => {
    router.route('/products/:id/images')
        .get((req, res, next) => {
            var productId = exHelper.paramIsRequired(req, "id");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            productImageRepository.getByProductId(productId, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        }).post((req, res, next) => {
            exHelper.adminPermission(req, next);

            var productId = exHelper.paramIsRequired(req, "id");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            var imageUrl = exHelper.paramIsRequired(req, "imageUrl");
            if (!imageUrl)
                return exHelper.entityMissing(req, "imageUrl", next);

            productImageRepository.insert(productId, imageUrl, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        }).delete((req, res, next) => {
            exHelper.adminPermission(req, next);
            var productId = exHelper.paramIsRequired(req, "id");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            productImageRepository.deleteByProductId(productId, (err, data) => {
                if (err)
                    return next(err);

                res.json('deleted all by product id');
            });
        });
}

module.exports = r;