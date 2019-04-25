var newsRepository = require('../app/repositories/newsRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');

var r = {};

r.init = (router) => {
    router.route('/news')
        .get((req, res, next) => {
            var isFull = req.query.isFull;
            if (isFull) {
                newsRepository.getAll((err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            } else {
                newsRepository.get(req.count, req.skipPages, (err, data) => {
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

            var dateTime = exHelper.paramIsRequired(req, "dateTime");
            if (!dateTime)
                return exHelper.entityMissing(req, "dateTime", next);

            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            var content = exHelper.paramIsRequired(req, "content");
            if (!content)
                return exHelper.entityMissing(req, "content", next);

            var imageUrl = exHelper.paramIsRequired(req, "imageUrl");
            if (!imageUrl)
                return exHelper.entityMissing(req, "imageUrl", next);

            newsRepository.insert(title, dateTime, jalaliDateTime, content, imageUrl, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/news/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            newsRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'news id ' + id, next);

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

            var dateTime = exHelper.paramIsRequired(req, "dateTime");
            if (!dateTime)
                return exHelper.entityMissing(req, "dateTime", next);

            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            var content = exHelper.paramIsRequired(req, "content");
            if (!content)
                return exHelper.entityMissing(req, "content", next);

            var imageUrl = exHelper.paramIsRequired(req, "imageUrl");
            if (!imageUrl)
                return exHelper.entityMissing(req, "imageUrl", next);

            newsRepository.update(id, title, dateTime, jalaliDateTime, content, imageUrl, (err, data) => {
                if (err)
                    return next(err);

                var edited = {
                    Id: id,
                    Title: title,
                    DateTime: dateTime,
                    JalaliDateTime: jalaliDateTime,
                    Content: content,
                    ImageUrl: imageUrl
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            exHelper.adminPermission(req, next);

            newsRepository.delete(req.params.id, (err, data) => {
                if (err)
                    return next(err);

                res.json({Id: req.params.id});
            });
        });
}

module.exports = r;