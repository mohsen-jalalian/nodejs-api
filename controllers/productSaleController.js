var productSaleRepository = require('../app/repositories/productSaleRepository.js');
var exHelper = require('../exceptionHelper.js');
var jalalify = require('../app/utilities/jalalify.js');
var _ = require('underscore');

var r = {};

r.init = (router) => {
    router.route('/mostsoldproducts')
        .get((req, res, next) => {
            productSaleRepository.getMostSold(req.count, req.skipPages, (err, data) => {
                if (err)
                    return next(err);

                 _.each(data, (m) => {
                     m.LastSaleJalaliDateTime = jalalify.convertGregorianToJalali(m.LastSaleDateTime);
                 })
                res.json(data);
            });
        });

    router.route('/products/:id/salecount')
        .get((req, res, next) => {
            var id = req.params.id;
            productSaleRepository.getByProductId(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'product id ' + id, next);

                res.json(data);
            })
        });
}


module.exports = r;