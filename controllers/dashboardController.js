var newsRepository = require('../app/repositories/newsRepository.js');
var productSaleRepository = require('../app/repositories/productSaleRepository.js');
var productVisitRepository = require('../app/repositories/productVisitRepository.js');
var r = {};

r.init = (router) => {
    router.route('/dashboard')
        .get((req, res, next) => {
            var model = {};
            newsRepository.get(10, 0, (err, newsData) => {
                if (err)
                    return next(err);

                model.news = newsData;
                productSaleRepository.getMostSold(10, 0, (err, saleData) => {
                    if (err)
                        return next(err);

                    model.topSale = saleData;
                    productVisitRepository.getMostVisited(10, 0, (err, visitData) => {
                        if (err)
                            return next(err);

                        model.topVisit = visitData;
                        res.json(model);
                    })
                })
            });
        });
}

module.exports = r;