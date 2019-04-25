var accountProductVisitRepository = require('../app/repositories/accountProductVisitRepository.js');
var exHelper = require('../exceptionHelper.js');

var r = {};

r.init = (router) => {
    router.route('/mostvisitedaccountproducts')
        .get((req, res, next) => {
            var accountId = req.accountId;
            if (!accountId)
                return exHelper.entityMissing(req, "accountId", next);
                
            accountProductVisitRepository.getMostVisited(accountId, req.count, req.skipPages, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            });
        });

    router.route('/accountproductsvisitcount')
        .get((req, res, next) => {
            
            var accountId = req.accountId;
            if (!accountId)
                return exHelper.entityMissing(req, "accountId", next);

            var productId = exHelper.paramIsRequired(req, "productId");
            if (!productId)
                return exHelper.entityMissing(req, "productId", next);

            accountProductVisitRepository.getByProductId(accountId, productId, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            })
        });
}


module.exports = r;