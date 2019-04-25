var productPropertyRepository = require('../app/repositories/productPropertyRepository.js');
var exHelper = require('../exceptionHelper.js');

var r = {};

r.init = (router) => {
    router.route('/productproperties')
        .get((req, res, next) => {
            var isFull = req.query.isFull;
            if (isFull) {
                productPropertyRepository.getAll((err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            } else {
                productPropertyRepository.get(req.count, req.skipPages, (err, data) => {
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

            productPropertyRepository.insert(title, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/productproperties/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            productPropertyRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'product property id ' + id, next);

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

            productPropertyRepository.update(id, title, (err, data) => {
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

            productPropertyRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({Id: req.params.id});
            });
        });
}


module.exports = r;