var subCategoryRepository = require('../app/repositories/subCategoryRepository.js');
var exHelper = require('../exceptionHelper.js');
var r = {};

r.init = (router) => {
    router.route('/subcategories')
        .get((req, res, next) => {
             var isFull = req.query.isFull;
             if (isFull) {
                 subCategoryRepository.getAll((err, data) => {
                     if (err)
                         return next(err);

                     res.json(data);
                 });
             } else {
                 subCategoryRepository.get(req.count, req.skipPages, (err, data) => {
                     if (err)
                         return next(err);

                     res.json(data);
                 });
             }
        }).post((req, res, next) => {
            exHelper.adminPermission(req, next);

            var categoryId = exHelper.paramIsRequired(req, "categoryId");
            if (!categoryId)
                return exHelper.entityMissing(req, "categoryId", next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var priceRate = exHelper.paramIsRequired(req, "priceRate");
            if (!priceRate)
                return exHelper.entityMissing(req, "priceRate", next);

            var activationStateId = exHelper.paramIsRequired(req, "activationStateId");
            if (!activationStateId)
                return exHelper.entityMissing(req, "activationStateId", next);

            var existenceStateId = exHelper.paramIsRequired(req, "existenceStateId");
            if (!existenceStateId)
                return exHelper.entityMissing(req, "existenceStateId", next);

            subCategoryRepository.insert(categoryId, title, priceRate, activationStateId, existenceStateId, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/subcategories/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            subCategoryRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'sub category id ' + id, next);

                res.json(data);
            })
        })
        .put((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var categoryId = exHelper.paramIsRequired(req, "categoryId");
            if (!categoryId)
                return exHelper.entityMissing(req, "categoryId", next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var priceRate = exHelper.paramIsRequired(req, "priceRate");
            if (!priceRate)
                return exHelper.entityMissing(req, "priceRate", next);

            var activationStateId = exHelper.paramIsRequired(req, "activationStateId");
            if (!activationStateId)
                return exHelper.entityMissing(req, "activationStateId", next);

            var existenceStateId = exHelper.paramIsRequired(req, "existenceStateId");
            if (!existenceStateId)
                return exHelper.entityMissing(req, "existenceStateId", next);

            subCategoryRepository.update(id, categoryId, title, priceRate, activationStateId, existenceStateId, (err, data) => {
                if (err) {
                    return next(err);
                }

                var edited = {
                    Id: id,
                    CategoryId: categoryId,
                    Title: title,
                    PriceRate: priceRate,
                    ActivationStateId: activationStateId,
                    ExistenceStateId: existenceStateId,
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            subCategoryRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({
                    Id: req.params.id
                });
            });
        });

    router.route('/subcategories/:id/changetype')
        .put((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var typeId = exHelper.paramIsRequired(req, "typeId");
            if (!typeId)
                return exHelper.entityMissing(req, "typeId", next);

            subCategoryRepository.changeType(id, typeId, (err, data) => {
                if (err)
                    return next(err);

                res.json('ok');
            });
        });

    router.route('/subcategories/:id/changeactivationstate')
        .put((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var activationStateId = exHelper.paramIsRequired(req, "activationStateId");
            if (!activationStateId)
                return exHelper.entityMissing(req, "activationStateId", next);

            subCategoryRepository.changeActivationState(id, activationStateId, (err, data) => {
                if (err)
                    return next(err);

                res.json('ok');
            });
        });

    router.route('/subcategories/:id/changeexistencestate')
        .put((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var existenceStateId = exHelper.paramIsRequired(req, "existenceStateId");
            if (!existenceStateId)
                return exHelper.entityMissing(req, "existenceStateId", next);

            subCategoryRepository.changeExistenceState(id, existenceStateId, (err, data) => {
                if (err)
                    return next(err);

                res.json('ok');
            });
        });

    router.route('/categories/:id/subcategories')
        .get((req, res, next) => {

            var categoryId = exHelper.paramIsRequired(req, "id");
            if (!categoryId)
                return exHelper.entityMissing(req, "categoryId", next);

            subCategoryRepository.getByCategoryId(categoryId, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });
}

module.exports = r;