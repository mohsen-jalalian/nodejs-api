var accountRepository = require('../app/repositories/accountRepository.js');
var sessionRepository = require('../app/repositories/sessionRepository.js');
var profileRepository = require('../app/repositories/profileRepository.js');
var exHelper = require('../exceptionHelper.js');
var helper = require('../helper.js');
var jalalify = require('../app/utilities/jalalify.js');
var sc = require('../app/config/smsConfig.js');
var hash = require('object-hash');

var r = {};

r.init = (router) => {
    router.route('/accounts')
        .get((req, res, next) => {
            exHelper.adminPermission(req, next);

            var isFull = req.query.isFull;
            if (isFull) {
                accountRepository.getAll((err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            } else {
                accountRepository.get(req.count, req.skipPages, (err, data) => {
                    if (err)
                        return next(err);

                    res.json(data);
                });
            }
        }).post((req, res, next) => {

            var mobile = exHelper.paramIsRequired(req, "mobile");
            if (!mobile)
                return exHelper.entityMissing(req, "mobile", next);

            accountRepository.checkDuplicate(mobile, (err, data) => {
                if (err)
                    return next(err);

                if (data.length && !data[0].IsVerified)
                {
                    sc.sendSms(mobile, data[0].Code, () => {
                        res.json("sent");
                    })
                } 
                else if (data.length) {
                    var code = parseInt(helper.generateRandomNumber(1111, 9999));
                    var codeExpirationDateTime = helper.addDays(1);
                    accountRepository.update(data[0].Id, mobile, false, code, codeExpirationDateTime, (err, data) => {
                        sc.sendSms(mobile, code, () => {
                            res.json("sent");
                        })
                    })
                }
                else {
                    var code = parseInt(helper.generateRandomNumber(1111, 9999));
                    var codeExpirationDateTime = helper.addDays(1);
                    accountRepository.signup(mobile, code, codeExpirationDateTime, (err, data) => {
                        sc.sendSms(mobile, code, () => {
                            res.json("sent");
                        })
                    })
                }
            })
        });

    router.route('/accounts/:id')
        .get((req, res, next) => {
            var id = req.params.id;
            exHelper.adminAndSelfPermission(req, id, next);

            accountRepository.getById(id, (err, data) => {
                if (err)
                    return next(err);

                if (!data)
                    return exHelper.notFound(req, 'account id ' + id, next);

                res.json(data);
            })
        });

    router.route('/profile')
        .get((req, res, next) => {
            var accountId = req.accountId;
            exHelper.adminAndSelfPermission(req, accountId, next);

            profileRepository.getByAccountId(accountId, (err, data) => {
                if (err)
                    return next(err);

                res.json(data);
            })
        })
        .post((req, res, next) => {

            var accountId = req.accountId;
            exHelper.adminAndSelfPermission(req, accountId, next);

            var name = exHelper.paramIsRequired(req, "name");
            if (!name)
                return exHelper.entityMissing(req, "name", next);

            var lastName = exHelper.paramIsRequired(req, "lastName");
            if (!lastName)
                return exHelper.entityMissing(req, "lastName", next);

            var genderTypeId = exHelper.paramIsRequired(req, "genderTypeId");
            if (!genderTypeId)
                return exHelper.entityMissing(req, "genderTypeId", next);

            var birthdate = exHelper.paramIsRequired(req, "birthdate");
            if (!birthdate)
                return exHelper.entityMissing(req, "birthdate", next);

            var jalaliBirthdate = jalalify.convertGregorianToJalali(birthdate);

            profileRepository.getByAccountId(accountId, (err, data) => {
                if (err)
                    return next(err);

                if (data.length == 0) {
                    profileRepository.insert(accountId, name, lastName, genderTypeId, birthdate, jalaliBirthdate, (err, result) => {
                        if (err)
                            return next(err);
                        
                        res.json('profile inserted');
                    })
                }
                else {
                    var profile = data[0];
                    profileRepository.update(profile.Id, accountId, name, lastName, genderTypeId, birthdate, jalaliBirthdate, (err, result) => {
                        if (err)
                            return next(err);

                        res.json('profile updated');
                    })
                }
            })
        })
        .delete((req, res, next) => {
            var accountId = req.accountId;
            exHelper.adminAndSelfPermission(req, accountId, next);
            
            profileRepository.delete(accountId, (err, data) => {
                if (err)
                    return next(err);

                 res.json({
                     AccountId: req.accountId
                 });
            })
        });

    router.route('/resendcode')
        .post((req, res, next) => {

            var mobile = exHelper.paramIsRequired(req, "mobile");
            if (!mobile)
                return exHelper.entityMissing(req, "mobile", next);

            accountRepository.getByMobile(mobile, (err, data) => {
                if (err)
                    return next(err);

                if (data.length == 0)
                    return exHelper.unprocessableEntity(req, "mobile is not exist", next);

                var code = data[0].Code;
                sc.sendSms(mobile, code, () => {
                    res.json('resent');
                })
            })
        });

    router.route('/accountverification')
        .post((req, res, next) => {

            var mobile = exHelper.paramIsRequired(req, "mobile");
            if (!mobile)
                return exHelper.entityMissing(req, "mobile", next);
            
            var code = exHelper.paramIsRequired(req, "code");
            if (!code)
                return exHelper.entityMissing(req, "code", next);

            accountRepository.checkCode(mobile, code, (err, data) => {
                if (err)
                    return next(err);

                if (data.length == 0)
                    return exHelper.unprocessableEntity(req, "code is invalid", next);

                var account = data[0];
                accountRepository.verify(mobile, (err, data) => {
                    var clearSession = hash.sha1(new Date().toISOString());
                    sessionRepository.newSession(account.Id, clearSession, new Date(), (err, data) => {
                        if (err)
                            return next(err);

                        var model = {
                            AccountId: account.Id,
                            Session: clearSession
                        }
                        res.json(model);
                    });
                });
            })
        });
}

module.exports = r;