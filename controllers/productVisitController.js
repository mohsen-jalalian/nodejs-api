var productVisitRepository = require('../app/repositories/productVisitRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');
var _ = require('underscore');

var r = {};

r.init = (router) => {
    router.route('/mostvisitedproducts')
        .get((req, res, next) => {
            productVisitRepository.getMostVisited(req.count, req.skipPages, (err, data) => {
                if (err)
                    return next(err);

                _.each(data, (m) => {
                    m.LastSeenJalaliDateTime = jalalify.convertGregorianToJalali(m.LastSeenDateTime);
                })
                res.json(data);
            });
        });

    router.route('/products/:id/visitcount')
        .get((req, res, next) => {
            var id = req.params.id;
            productVisitRepository.getByProductId(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'product id ' + id, next);

                res.json(data);
            })
        });
}


module.exports = r;