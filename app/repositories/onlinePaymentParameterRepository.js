var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.OnlinePaymentParameter",
        null,
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.OnlinePaymentParameter WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByOnlinePaymentId = (onlinePaymentId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.OnlinePaymentParameter WHERE onlinePaymentId = @onlinePaymentId",
        [{
            key: 'onlinePaymentId',
            value: onlinePaymentId
        }],
        callback
    );
}

r.insert = (onlinePaymentId, key, value, callback) => {
    sqlCommand.run(
        'INSERT INTO Payment.OnlinePaymentParameter VALUES(@onlinePaymentId, @key, @value) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'onlinePaymentId',
                value: onlinePaymentId
            },
            {
                key: 'key',
                value: key
            },
            {
                key: 'value',
                value: value
            }
        ],
        callback
    );
}

r.update = (id, onlinePaymentId, key, value, callback) => {
    sqlCommand.run(
        'UPDATE Payment.OnlinePaymentParameter SET onlinePaymentId = @onlinePaymentId, [key] = @key, [value] = @value WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'onlinePaymentId',
                value: onlinePaymentId
            },
            {
                key: 'key',
                value: key
            },
            {
                key: 'value',
                value: value
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Payment.OnlinePaymentParameter WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.deleteByOnlinePaymentId = (onlinePaymentId, callback) => {
    sqlCommand.run(
        'DELETE FROM Payment.OnlinePaymentParameter WHERE onlinePaymentId = @onlinePaymentId',
        [{
            key: 'onlinePaymentId',
            value: onlinePaymentId
        }],
        callback
    );
}

module.exports = r;