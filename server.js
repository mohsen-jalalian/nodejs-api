// server.js
'use strict';

//repositories
var sessionRepository = require('./app/repositories/sessionRepository.js');
//==============================================================================
// controllers
var accountController = require('./controllers/accountController.js');
var accountProductVisitController = require('./controllers/accountProductVisitController.js');
var categoryController = require('./controllers/categoryController.js');
var dashboardController = require('./controllers/dashboardController.js');
var imageController = require('./controllers/imageController.js');
var imeiController = require('./controllers/imeiController.js');
var invoiceController = require('./controllers/invoiceController.js');
var invoiceItemController = require('./controllers/invoiceItemController.js');
var newsController = require('./controllers/newsController.js');
var onlinePaymentController = require('./controllers/onlinePaymentController.js');
var onlinePaymentParameterController = require('./controllers/onlinePaymentParameterController.js');
var productController = require('./controllers/productController.js');
var productImageController = require('./controllers/productImageController.js');
var productPriceHistoryController = require('./controllers/productPriceHistoryController.js');
var productPropertyController = require('./controllers/productPropertyController.js');
var productPropertyValueController = require('./controllers/productPropertyValueController.js');
var productSaleController = require('./controllers/productSaleController.js');
var productVisitController = require('./controllers/productVisitController.js');
var requestController = require('./controllers/requestController.js');
var subCategoryController = require('./controllers/subCategoryController.js');
var transactionController = require('./controllers/transactionController.js');
var transactionParameterController = require('./controllers/transactionParameterController.js');
//==============================================================================

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var fileUpload = require('express-fileupload');
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var fs = require('fs');
var config = require('./app/config/config');
var jalalify = require('./app/utilities/jalalify.js');
var methodOverride = require('method-override');
var helper = require('./app/utilities/helper.js');
var _ = require('underscore');
var sessions = require('./sessions.js');
var exHelper = require('./exceptionHelper.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(fileUpload());

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
imageController.init(router);

//check tokens
router.use(function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
        sessionRepository.checkSession(token, (err, data) => {
            if (err)
                return next(err);

            if (data.length > 0)
            {
                req.token = token;
                req.accountId = data[0].AccountId;
                req.isAdmin = false;
                return next();
            }
            else {
                var session = _.find(sessions.sessions, function (s) {
                    return s.session === token;
                });
                if (session) {
                    req.isAdmin = session.isAdmin;
                    return next();
                }
                else {
                    return res.status(403).send({
                        code: 403,
                        message: 'unauthorized'
                    });
                }
            }
        })
    } else {
        return res.status(403).send({
            code: 403,
            message: 'unauthorized'
        });
    }
});

router.use((req, res, next) => {
    console.log(`--mahtel api: ${jalalify.jalali_today_date_time()} ${req.method} - ${req.originalUrl}`);
    next();
})

//get count and skip in middleware for all actions
router.use((req, res, next) => {
    var count = exHelper.paramIsRequired(req, "_count");
    if (!count)
        count = 50;
    req.count = parseInt(count);

    var skipPages = exHelper.paramIsRequired(req, "_skip");
    if (!skipPages)
        skipPages = 0;    
    req.skipPages = parseInt(skipPages);

    next();
})

router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });   
});

dashboardController.init(router);
accountController.init(router);
accountProductVisitController.init(router);
categoryController.init(router);
imeiController.init(router);
invoiceController.init(router);
invoiceItemController.init(router);
newsController.init(router);
onlinePaymentController.init(router);
onlinePaymentParameterController.init(router);
productController.init(router);
productImageController.init(router);
productPriceHistoryController.init(router);
productPropertyController.init(router);
productPropertyValueController.init(router);
productSaleController.init(router);
productVisitController.init(router);
requestController.init(router);
subCategoryController.init(router);
transactionController.init(router);
transactionParameterController.init(router);

// ----------------------------------------------------
//error handling
router.use((req, res) => {
    console.log('error occured: ' + req.statusMessage);
    
    if (!req.statusCode)
        req.statusCode = 500;

    res.status(req.statusCode).send({code: req.statusCode, message: req.statusMessage});
})

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(config.web.port);
console.log('start MahTel api: listening to ' + config.web.port);

//prototypes
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}