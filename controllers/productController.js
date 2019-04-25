var productRepository = require('../app/repositories/productRepository.js');
var productVisitRepository = require('../app/repositories/productVisitRepository.js');
var productImageRepository = require('../app/repositories/productImageRepository.js');
var accountProductVisitRepository = require('../app/repositories/accountProductVisitRepository.js');
var productPropertyValueRepository = require('../app/repositories/productPropertyValueRepository.js');
var exHelper = require('../exceptionHelper.js');

var r = {};

r.init = (router) => {
    router.route('/products')
        .get((req, res, next) => {
            var isFull = req.query.isFull;
            if (isFull) {
                productRepository.getAll((err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            } else {
                productRepository.get(req.count, req.skipPages, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
        }).post((req, res, next) => {
            exHelper.adminPermission(req, next);
            
            var subCategoryId = exHelper.paramIsRequired(req, "subCategoryId");
            if (!subCategoryId)
                return exHelper.entityMissing(req, "subCategoryId", next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var activationStateId = exHelper.paramIsRequired(req, "activationStateId");
            if (!activationStateId)
                return exHelper.entityMissing(req, "activationStateId", next);
            
            var existenceStateId = exHelper.paramIsRequired(req, "existenceStateId");
            if (!existenceStateId)
                return exHelper.entityMissing(req, "existenceStateId", next);

            var price = exHelper.paramIsRequired(req, "price");
            if (!price)
                return exHelper.entityMissing(req, "price", next);

            var brand = exHelper.paramIsRequired(req, "brand");
            var description = exHelper.paramIsRequired(req, "description");

            productRepository.insert(subCategoryId, brand, title, activationStateId, existenceStateId, price, description, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/subcategories/:subcategory_id/products')
        .get((req, res, next) => {
            var subcategory_id = exHelper.paramIsRequired(req, "subcategory_id");
            if (!subcategory_id)
                return exHelper.entityMissing(req, "subcategory_id", next);

            productRepository.getBySubCategoryId(subcategory_id, req.count, req.skipPages, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/products/:id')
        .get((req, res, next) => {
            var productId = req.params.id;
            var accountId = req.accountId;
            var now = new Date();

            var getAsync = () => {
                var promise = new Promise((resolve, reject) => {
                    productRepository.getById(productId, (err, data) => {
                        resolve({
                            product: data[0]
                        });
                    });
                });
                return promise;
            };

            var getValuesAsync = (result) => {
                var product = result.product;
                var promise = new Promise((resolve, reject) => {
                    productPropertyValueRepository.getByProductId(productId, (err, data) => {
                        product.Values = [];
                        product.Values = data;
                        resolve({
                            product: product
                        });
                    });
                });
                return promise;
            };

            var getImagesAsync = (result) => {
                var product = result.product;
                var promise = new Promise((resolve, reject) => {
                    productImageRepository.getByProductId(productId, (err, data) => {
                        product.Images = [];
                        product.Images = data;
                        resolve({
                            product: product
                        });
                    });
                });
                return promise;
            };

            var visitAsync = (result) => {
                var promise = new Promise((resolve, reject) => {
                    productVisitRepository.visit(productId, now, (err, data) => {
                        resolve({
                            product: result.product
                        });
                    });
                });
                return promise;
            };

            var accountVisitAsync = (result) => {
                var promise = new Promise((resolve, reject) => {
                    if (accountId) {
                        accountProductVisitRepository.visit(accountId, productId, now, (err, data) => {
                            resolve({
                                product: result.product
                            });
                        });
                    } else {
                        resolve({
                            product: result.product
                        });
                    }
                });
                return promise;
            };

            getAsync().then(getValuesAsync).then(getImagesAsync).then(visitAsync).then(accountVisitAsync).then((data) => {
                return res.json(data.product);
            });
        })
        .put((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var subCategoryId = exHelper.paramIsRequired(req, "subCategoryId");
            if (!subCategoryId)
                return exHelper.entityMissing(req, "subCategoryId", next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var activationStateId = exHelper.paramIsRequired(req, "activationStateId");
            if (!activationStateId)
                return exHelper.entityMissing(req, "activationStateId", next);

            var existenceStateId = exHelper.paramIsRequired(req, "existenceStateId");
            if (!existenceStateId)
                return exHelper.entityMissing(req, "existenceStateId", next);

            var price = exHelper.paramIsRequired(req, "price");
            if (!price)
                return exHelper.entityMissing(req, "price", next);

            var brand = exHelper.paramIsRequired(req, "brand");
            var description = exHelper.paramIsRequired(req, "description");

            productRepository.update(id, subCategoryId, brand, title, activationStateId, existenceStateId, price, description, (err, data) => {
                if (err)
                    return next(err);

                var edited = {
                    Id: id,
                    SubCategoryId: subCategoryId,
                    Brand: brand,
                    Title: title,
                    ActivationStateId: activationStateId,
                    ExistenceStateId: existenceStateId,
                    Price: price,
                    Description: description
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            productRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({
                    Id: req.params.id
                });
            });
        });

    router.route('/products/:id/image')
        .get((req, res, next) => {
            var id = req.params.id;
            productImageRepository.getByProductId(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'product image id ' + id, next);

                res.json(data);
            })
        })
        .post((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var imageUrl = exHelper.paramIsRequired(req, "imageUrl");
            if (!imageUrl)
                return exHelper.entityMissing(req, "imageUrl", next);

            productImageRepository.insert(id, imageUrl, (err, data) => {
                if (err)
                    return next(err);
                res.json(data);
            });
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            productImageRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json("deleted...");
            });
        });
}

module.exports = r;