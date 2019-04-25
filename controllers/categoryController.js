var categoryRepository = require('../app/repositories/categoryRepository.js');
var exHelper = require('../exceptionHelper.js');

var r = {};

r.init = (router) => {
    router.route('/categories')
        .get((req, res, next) => {
            
            var isFull = req.query.isFull;
            if (isFull) {
                categoryRepository.getAll((err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            } else {
                categoryRepository.get(req.count, req.skipPages, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
        }).post((req, res, next) => {
            exHelper.adminPermission(req, next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var imageUrl = exHelper.paramIsRequired(req, "imageUrl");
            if (!imageUrl)
                return exHelper.entityMissing(req, "imageUrl", next);

            categoryRepository.insert(title, imageUrl, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/categories/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            categoryRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'category id ' + id, next);

                res.json(data);
            })
        })
        .put((req, res, next) => {
            exHelper.adminPermission(req, next);

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var imageUrl = exHelper.paramIsRequired(req, "imageUrl");
            if (!imageUrl)
                return exHelper.entityMissing(req, "imageUrl", next);

            categoryRepository.update(id, title, imageUrl, (err, data) => {
                if (err)
                    return next(err);

                var edited = {
                    Id: id,
                    Title: title
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);
            
            categoryRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({Id: req.params.id});
            });
        });
}

module.exports = r;