var imeiRepository = require('../app/repositories/imeiRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');
var r = {};

r.init = (router) => {
    router.route('/imeis')
        .get((req, res, next) => {
            var code = req.query.code;
            if (code) {
                imeiRepository.getByImei(code, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
            else {
                exHelper.adminPermission(req, next);
                var isFull = req.query.isFull;
                if (isFull) {
                    imeiRepository.getAll((err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                } 
                else {
                    imeiRepository.get(req.count, req.skipPages, (err, data) => {
                        if (err)
                            return next(err);

                        res.json(data);
                    });
                }
            }
        });

    router.route('/imeis/activated')
        .get((req, res, next) => {
            exHelper.adminPermission(req, next);
            imeiRepository.getActivateds((err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/imeis/activate')
        .put((req, res, next) => {
            var code = exHelper.paramIsRequired(req, "code");
            if (!code)
                return exHelper.entityMissing(req, "code", next);

            imeiRepository.getByImei(code, (err, data) => {
                if (err)
                    return next(err);

                if (data.length === 0)
                    return exHelper.notFound(req, 'code ' + code, next);

                var imei = data[0];
                if (imei.IsActivated)
                    return exHelper.unprocessableEntity(req, "this code is activated before.", next);

                imeiRepository.activate(imei.Id, () => {
                    
                    var accountId = req.accountId;
                    var jalaliToday = jalalify.jalali_today_date_time();
                    var today = new Date();
                    imeiRepository.registerImei(accountId, imei.Id, today, jalaliToday, (err, data) => {
                        if (err)
                            return next(err);

                        res.json({
                            RegisteredCode: imei.ActiveCode
                        });
                    });
                })
            });
        });
}

module.exports = r;