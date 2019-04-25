var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Account",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Account " +
        "ORDER BY Id DESC " +
        "OFFSET @pgc * (@skpg) ROWS " +
        "FETCH NEXT @pgc ROWS ONLY",
        [
            {
                key: 'pgc',
                value: pgc
            }, 
            {
                key: 'skpg',
                value: skpg
            }
        ],
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Account WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.checkDuplicate = (mobile, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Account WHERE mobile = @mobile",
        [{
            key: 'mobile',
            value: mobile
        }],
        callback
    );
}

r.signup = (mobile, code, codeExpirationDateTime, callback) => {
    sqlCommand.run(
        "INSERT INTO Account.Account (Mobile, IsVerified, Code, CodeExpirationDateTime) VALUES (@mobile, @isVerified, @code, @codeExpirationDateTime)",
        [
            {
                key: 'mobile',
                value: mobile
            },
            {
                key: 'isVerified',
                value: false
            },
            {
                key: 'code',
                value: code
            },
            {
                key: 'codeExpirationDateTime',
                value: codeExpirationDateTime
            }
        ],
        callback
    );
}

r.update = (id, mobile, isVerified, code, codeExpirationDateTime, callback) => {
    sqlCommand.run(
        "UPDATE Account.Account SET mobile = @mobile, IsVerified = @isVerified, Code = @code, CodeExpirationDateTime = @codeExpirationDateTime WHERE Id = @id",
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'mobile',
                value: mobile
            },
            {
                key: 'isVerified',
                value: isVerified
            },
            {
                key: 'code',
                value: code
            },
            {
                key: 'codeExpirationDateTime',
                value: codeExpirationDateTime
            }
        ],
        callback
    );
}

r.getByMobile = (mobile, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Account WHERE Mobile = @mobile",
        [
            {
                key: 'mobile',
                value: mobile
            }
        ],
        callback
    );
}

r.checkCode = (mobile, code, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Account WHERE Mobile = @mobile AND Code = @code",
        [
            {
                key: 'mobile',
                value: mobile
            },
            {
                key: 'code',
                value: code
            }
        ],
        callback
    );
}

r.verify = (mobile, callback) => {
    sqlCommand.run(
        "UPDATE Account.Account SET IsVerified = @isVerified, Code = @code, CodeExpirationDateTime = @codeExpirationDateTime WHERE Mobile = @mobile",
        [
            {
                key: 'isVerified',
                value: true
            },
            {
                key: 'mobile',
                value: mobile
            },
            {
                key: 'code',
                value: null
            },
            {
                key: 'codeExpirationDateTime',
                value: null
            }
        ],
        callback
    );
}

module.exports = r;