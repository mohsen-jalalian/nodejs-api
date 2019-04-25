var ex = {};

ex.paramIsRequired = (req, field) => {
    return req.query[field] || req.params[field] || req.body[field];
}

ex.adminPermission = (req, next) => {
    if (!req.isAdmin)
        return ex.accessDenied(req, next);
}

ex.adminAndSelfPermission = (req, accountId, next) => {
    if (!req.isAdmin && req.accountId != accountId)
        return ex.accessDenied(req, next);
}

ex.unprocessableEntity = (req, message, next) => {
    req.statusCode = 422;
    req.statusMessage = message;
    return next();
}

ex.entityMissing = (req, field, next) => {
    req.statusCode = 422;
    req.statusMessage = field + ' is missing.';
    return next();
}

ex.notFound = (req, message, next) => {
    req.statusCode = 404;
    req.statusMessage = message + ' not found.';
    return next();
}

ex.accessDenied = (req, next) => {
    req.statusCode = 403;
    req.statusMessage = 'access denied.';
    return next();
}

ex.internalServerError = (req, next) => {
    req.statusCode = 500;
    return next();
}

ex.duplicateEntity = (req, field, next) => {
    req.statusCode = 422;
    req.statusMessage = field + ' is duplicate.';
    return next();
}

module.exports = ex;