var requestRepository = require('../app/repositories/requestRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');
var r = {};

r.init = (router) => {
    router.route('/requests')
        .get((req, res, next) => {
            var accountId = req.query.account_id;
            if (accountId) {
                exHelper.adminAndSelfPermission(req, accountId, next);
                requestRepository.getByAccountId(accountId, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
            else {
                exHelper.adminPermission(req, next);
                var isFull = req.query.isFull;
                if (isFull) {
                    requestRepository.getAll((err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                } 
                else {
                    requestRepository.get(req.count, req.skipPages, (err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                }
            }
        }).post((req, res, next) => {

            var accountId = exHelper.paramIsRequired(req, "accountId");
            if (!accountId)
                return exHelper.entityMissing(req, "accountId", next);

            exHelper.adminAndSelfPermission(req, accountId, next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var description = exHelper.paramIsRequired(req, "description");
            if (!description)
                return exHelper.entityMissing(req, "description", next);

            var dateTime = new Date();
            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            requestRepository.insert(accountId, title, description, dateTime, jalaliDateTime, false, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/requests/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            requestRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'request id ' + id, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);                

                res.json(data);
            })
        })
        .put((req, res, next) => {

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var accountId = exHelper.paramIsRequired(req, "accountId");
            if (!accountId)
                return exHelper.entityMissing(req, "accountId", next);

            exHelper.adminAndSelfPermission(req, accountId, next);

            var title = exHelper.paramIsRequired(req, "title");
            if (!title)
                return exHelper.entityMissing(req, "title", next);

            var description = exHelper.paramIsRequired(req, "description");
            if (!description)
                return exHelper.entityMissing(req, "description", next);

            var isSeen = exHelper.paramIsRequired(req, "isSeen");
            if (!isSeen)
                return exHelper.entityMissing(req, "isSeen", next);

            var dateTime = new Date();
            var jalaliDateTime = jalalify.convertGregorianToJalali(dateTime);

            requestRepository.update(id, accountId, title, description, dateTime, jalaliDateTime, isSeen, (err, data) => {
                if (err) {
                    return next(err);
                }

                var edited = {
                    Id: id,
                    AccountId: accountId, 
                    Title: title, 
                    Description: description, 
                    DateTime: dateTime, 
                    JalaliDateTime: jalaliDateTime,
                    IsSeen: isSeen
                };
                res.json(edited);
            });
        })
        .delete((req, res, next) => {
            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            requestRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'request id ' + id, next);

                exHelper.adminAndSelfPermission(req, data[0].AccountId, next);

                requestRepository.delete(req.params.id, (err, data) => {
                    if (err)
                        return next(err);

                    res.json({
                        Id: req.params.id
                    });
                });
            });
        });

    router.route('/requests/:id/seen')
        .put((req, res, next) => {

            var id = exHelper.paramIsRequired(req, "id");
            if (!id)
                return exHelper.entityMissing(req, "id", next);

            var accountId = req.accountId;
            exHelper.adminAndSelfPermission(req, accountId, next);

            requestRepository.seen(id, (err, data) => {
                if (err) {
                    return next(err);
                }

                res.json('done');
            });
        });
}

module.exports = r;