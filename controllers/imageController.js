var fs = require('fs');
var config = require('../app/config/config');
var helper = require('../app/utilities/helper.js');
var r = {};

r.init = (router) => {
    router.route('/images/:image_name')
        .get(function (req, res) {
            if (!req.params.image_name) {
                var file = fs.readFileSync('./app/img/logo.png');
                res.setHeader('Content-Type', 'image/png')
                res.send(file);
            }
            try {
                var filePath = __dirname + config.store_path.images + req.params.image_name;
                var file = fs.readFileSync(filePath);
                res.setHeader('Content-Type', 'image/*')
                res.send(file);
            } catch (error) {
                var file = fs.readFileSync('./app/img/logo.png');
                res.setHeader('Content-Type', 'image/png')
                res.send(file);
            }
        }).delete(function (req, res, next) {
            if (!req.params.image_name) {
                return;
            }

            try {
                var filePath = __dirname + config.store_path.images + req.params.image_name;
                var file = fs.unlinkSync(filePath);
            } catch (error) {
                return next(error);
            }
        });

    router.route('/images/upload')
        .post(function (req, res) {
            var file;

            if (!req.files) {
                res.send('No files were uploaded.');
                return;
            }

            var ext = helper.getExtention(req.body.mimetype);
            if (ext == null) {
                res.status(422).send('file not supported.');
                return;
            }

            file = req.files.buffer;
            var fileName = new Date().getTime() + ext;

            file.mv(__dirname + config.store_path.images + fileName, function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send({
                        filename: fileName
                    })
                }
            });
        });
}

module.exports = r;